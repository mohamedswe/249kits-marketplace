from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=True)
    
    # Address information - ADD THESE MISSING FIELDS
    address_line1 = Column(String, nullable=False)
    address_line2 = Column(String, nullable=True)  # This was missing
    city = Column(String, nullable=False)
    state = Column(String, nullable=True)          # This was missing
    postal_code = Column(String, nullable=True)    # This was missing
    country = Column(String, default="Sudan")
    
    # Order details - ADD THESE MISSING FIELDS
    subtotal = Column(Float, nullable=False)       # This was missing
    shipping_cost = Column(Float, default=0.0)    # This was missing
    tax_amount = Column(Float, default=0.0)       # This was missing
    total_amount = Column(Float, nullable=False)
    order_status = Column(String, default="pending")

    # Payment tracking
    payment_intent_id = Column(String, nullable=True)
    payment_status = Column(String, default="pending")  # pending, paid, failed, refunded

    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to order items
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    
    product_type = Column(String, nullable=False)
    color = Column(String, nullable=False)
    color_name = Column(String, nullable=False)    # ADD this if missing
    size = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)    # ADD this if missing
    # product_images = Column(Text, nullable=True)   # ADD this if missing
    
    order = relationship("Order", back_populates="items")