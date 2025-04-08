import enum
from sqlalchemy import Column, Integer, Float, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from database import Base


class Order_status(str, enum.Enum):
    pending = "בהמתנה"
    in_process = "בתהליך"
    completed = "הושלמה"


class Goods(Base):
    __tablename__ = "Goods"

    id = Column(UNIQUEIDENTIFIER, primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String(80), unique=False, index=False)
    price = Column(Float)
    min_amount = Column(Integer)

    supplier_id = Column(UNIQUEIDENTIFIER, ForeignKey("Supplier.id"), nullable=True)
    # קשר של רבים לאחד
    supplier = relationship("Supplier", back_populates="goods")
    goods_in_order = relationship("Goods_in_order", back_populates="goods")


class Supplier(Base):
    __tablename__ = "Supplier"

    id = Column(UNIQUEIDENTIFIER, primary_key=True, index=True, default=uuid.uuid4)
    company_name = Column(String(80))
    telephone = Column(String(80))
    representative = Column(String(80))
    password = Column(String(255))

    # לספק יש רשימת סחורות - קשר של אחד לרבים
    goods = relationship("Goods", back_populates="supplier")
    # קשר עם הזמנות
    orders = relationship("Orders", back_populates="supplier")

class Orders(Base):
    __tablename__ = "Orders"

    id = Column(UNIQUEIDENTIFIER, primary_key=True, index=True, default=uuid.uuid4)
    status = Column(Enum(Order_status), default=Order_status.pending)

    # לכל הזמנה יש רשימה של "סחורה בהזמנה"
    goods_in_order = relationship("Goods_in_order", back_populates="order")

    # שדה לקישור לספק
    supplier_id = Column(UNIQUEIDENTIFIER, ForeignKey("Supplier.id"), nullable=False)

    # קשר בין הזמנה לספק
    supplier = relationship("Supplier", back_populates="orders")

class Goods_in_order(Base):
    __tablename__ = "Goods_in_order"

    id = Column(UNIQUEIDENTIFIER, primary_key=True, index=True, default=uuid.uuid4)
    order_id = Column(UNIQUEIDENTIFIER, ForeignKey("Orders.id"), nullable=True)
    goods_id = Column(UNIQUEIDENTIFIER, ForeignKey("Goods.id"), nullable=True)
    amount = Column(Integer)

    order = relationship("Orders", back_populates="goods_in_order")
    goods = relationship("Goods", back_populates="goods_in_order")
