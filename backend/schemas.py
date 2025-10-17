from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_type: str
    color: str
    color_name: str
    size: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "Sudan"
    payment_intent_id: Optional[str] = None
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    total_amount: float
    order_status: str
    payment_status: str
    payment_intent_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True