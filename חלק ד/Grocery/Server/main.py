from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from sqlalchemy.orm import joinedload
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from database import engine, Base, SessionLocal
import models
import schemas
import uvicorn
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from datetime import timedelta

# יצירת הטבלאות במסד הנתונים
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# הוספת הגדרת CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # תומך בכל סוגי הבקשות
    allow_headers=["*"],  # תומך בכותרות שונות
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/suppliers/", response_model=List[schemas.SupplierResponse])
def get_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(models.Supplier).all()
    return suppliers


@app.get("/goods/", response_model=List[schemas.GoodsResponse])
def get_goods(db: Session = Depends(get_db)):
    goods = db.query(models.Goods).all()
    return goods


@app.get("/orders/", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    try:
        # שליפת ההזמנות תוך התחשבות בקשר עם טבלת סחורה בהזמנה והסחורות עצמם
        orders = db.query(models.Orders).options(
            joinedload(models.Orders.goods_in_order)
                .joinedload(models.Goods_in_order.goods)  # טעינת הסחורות
        ).all()

        # המרה להחזרת התוצאה בפורמט הנכון
        return [
            schemas.OrderResponse(
                id=order.id,
                status=order.status,
                supplier_id=order.supplier_id if order.supplier else None,
                goods_in_order=[
                    schemas.GoodsInOrderResponse(
                        goods_id=goods.goods_id,
                        amount=goods.amount,
                        name=goods.goods.name,
                        # הוספת פרטי הסחורה עבור כל פריט
                        goods_name=goods.goods.name,
                        goods_price=goods.goods.price
                    ) for goods in order.goods_in_order
                ]
            )
            for order in orders
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.get("/by-supplier/{supplier_id}")
def get_orders_by_supplier(supplier_id: UUID, db: Session = Depends(get_db)):
    orders = (
        db.query(models.Orders)
            .join(models.Goods_in_order, models.Orders.id == models.Goods_in_order.order_id)
            .join(models.Goods, models.Goods_in_order.goods_id == models.Goods.id)
            .filter(models.Goods.supplier_id == supplier_id)
            .distinct()
            .all()
    )
    if not orders:
        print(f"No orders found for supplier {supplier_id}")
    return orders


@app.post("/goods/", response_model=schemas.GoodsResponse)
def create_goods(goods: schemas.GoodsCreate, db: Session = Depends(get_db)):
    # בדיקה האם הספק קיים
    if goods.supplier_id:
        supplier = db.query(models.Supplier).filter(models.Supplier.id == goods.supplier_id).first()
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")

    db_goods = models.Goods(
        id=uuid4(),
        name=goods.name,
        price=goods.price,
        min_amount=goods.min_amount,
        supplier_id=goods.supplier_id
    )
    db.add(db_goods)
    db.commit()
    db.refresh(db_goods)

    return db_goods


@app.post("/orders/post", response_model=schemas.OrderResponse)
def create_orders(orders: schemas.OrderCreate, db: Session = Depends(get_db)):
    # יצירת הזמנה חדשה עם UUID חדש
    db_orders = models.Orders(
        id=uuid4(),
        status=orders.status,
        supplier_id=orders.supplier_id,
    )
    db.add(db_orders)
    db.commit()
    db.refresh(db_orders)

    # הוספת פריטי הסחורה להזמנה, ולכל פריט נוצר UUID חדש
    for good in orders.goods_in_order:
        db_goods_in_order = models.Goods_in_order(
            goods_id=good.goods_id,  # ה-UUID של הסחורה נשאר כפי שהוא (נשלח מהלקוח)
            amount=good.amount,
            order_id=db_orders.id  # ה-UUID של ההזמנה נקבע אוטומטית
        )
        db.add(db_goods_in_order)

    db.commit()

    return db_orders


@app.post("/suppliers/signup", response_model=schemas.SupplierResponse)
def signup_supplier(supplier: schemas.SupplierSignup, db: Session = Depends(get_db)):
    print("Parsed supplier model:", supplier)
    # אם ספק עם אותו שם חברה כבר קיים, נחזיר שגיאה
    existing_supplier = db.query(models.Supplier).filter(models.Supplier.company_name == supplier.company_name).first()
    if existing_supplier:
        raise HTTPException(status_code=400, detail="Supplier already exists")

    salt = bcrypt.gensalt()  # הגדרת Salt תקין
    hashed_password = bcrypt.hashpw(supplier.password.encode('utf-8'), salt)

    # יצירת ספק חדש
    db_supplier = models.Supplier(
        id=uuid4(),  # המערכת יוצרת UUID חדש
        company_name=supplier.company_name,
        telephone=supplier.telephone,
        representative=supplier.representative,
        password=hashed_password,
    )

    # הוספת הסחורות אם יש
    if supplier.goods:
        for good in supplier.goods:
            db_goods = models.Goods(
                name=good.name,
                price=good.price,
                min_amount=good.min_amount,
                supplier_id=db_supplier.id  #קשר לספק
            )
            db.add(db_goods)

    # הוספת הספק למאגר
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)

    return db_supplier


@app.get('/active-orders', response_model=List[schemas.OrderResponse])
def get_active_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Orders).filter(models.Orders.status != models.Order_status.completed).all()
    return orders


@app.post("/suppliers/login", response_model=schemas.SupplierResponse)
def login_supplier(supplier: schemas.SupplierLogin, db: Session = Depends(get_db)):
    # חיפוש הספק לפי מספר הטלפון
    supplier_in_db = db.query(models.Supplier).filter(models.Supplier.telephone == supplier.telephone).first()

    if not supplier_in_db:
        raise HTTPException(status_code=404, detail="Supplier not found")

    # השוואת הסיסמה עם הסיסמה המוצפנת במאגר הנתונים
    if not bcrypt.checkpw(supplier.password.encode('utf-8'), supplier_in_db.password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return supplier_in_db


@app.put("/supplier-confirm/{order_id}", response_model=schemas.OrderResponse)
def supplier_confirm_order(order_id: UUID, db: Session = Depends(get_db)):
    order = db.query(models.Orders).filter(models.Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="ההזמנה לא נמצאה")
    if order.status != models.Order_status.pending:
        raise HTTPException(status_code=400, detail="רק הזמנות בסטטוס 'בהמתנה' ניתנות לאישור")

    order.status = models.Order_status.in_process
    db.commit()
    db.refresh(order)
    return order


@app.put("/confirm-received/{order_id}", response_model=schemas.OrderResponse)
def confirm_order_received(order_id: UUID, db: Session = Depends(get_db)):
    order = db.query(models.Orders).filter(models.Orders.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="ההזמנה לא נמצאה")
    if order.status != models.Order_status.in_process:
        raise HTTPException(status_code=400, detail="אפשר לסמן כהושלם רק הזמנה בסטטוס 'בתהליך'")

    order.status = models.Order_status.completed
    db.commit()
    db.refresh(order)
    return order


# פונקציה לשליפת הזמנות עם פריטים
@app.get("/orders-with-goods")
def get_orders_with_goods(db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()  # שליפת כל ההזמנות
    orders_with_goods = []

    for order in orders:
        goods = db.query(models.Good).filter(models.Good.order_id == order.id).all()  # שליפת הפריטים של כל הזמנה
        orders_with_goods.append({
            "order_id": order.id,
            "goods": [{"name": good.name, "quantity": good.quantity} for good in goods]
        })

    return orders_with_goods
