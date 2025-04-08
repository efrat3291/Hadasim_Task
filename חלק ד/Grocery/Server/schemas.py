from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from models import Goods, Order_status


class Goods_in_orderCreate(BaseModel):
    goods_id: Optional[UUID] = None
    # order_id: Optional[UUID] = None
    price: float
    amount: int

    class Config:
        orm_mode = True


class GoodsInOrderResponse(BaseModel):
    goods_id: UUID
    amount: int

    class Config:
        orm_mode = True


class GoodsCreate(BaseModel):
    name: str
    price: float
    min_amount: int

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True


class OrderCreate(BaseModel):
    supplier_id: UUID
    goods_in_order: List[Goods_in_orderCreate]
    status: Order_status

    class Config:
        orm_mode = True


class OrderResponse(BaseModel):
    id: UUID
    status: str
    supplier_id: Optional[UUID]
    goods_in_order: List[GoodsInOrderResponse]

    class Config:
        orm_mode = True


class Goods_in_orderResponse(BaseModel):
    name: str
    amount: int

    class Config:
        orm_mode = True


class GoodsResponse(BaseModel):
    id: UUID
    name: str
    price: float
    min_amount: int
    supplier_id: Optional[UUID]

    class Config:
        orm_mode = True


class SupplierResponse(BaseModel):
    id: UUID
    company_name: str
    telephone: str
    representative: str

    class Config:
        orm_mode = True


class SupplierCreate(BaseModel):
    telephone: str
    representative: str

    class Config:
        orm_mode = True


class SupplierSignup(BaseModel):
    company_name: str
    telephone: str
    representative: str
    password: str
    goods: Optional[List[GoodsCreate]]

    class Config:
        from_attributes = True


class SupplierLogin(BaseModel):
    telephone: str
    password: str
