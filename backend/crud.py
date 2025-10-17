from sqlalchemy.orm import Session
from models import Order, OrderItem  # Remove Customer from here
from schemas import OrderCreate
from shipping import calculate_shipping_cost
import json
import requests
import os
from datetime import datetime

def create_order(db: Session, order_data: OrderCreate) -> Order:
    """Create a new order with items and calculate real shipping"""
    
    # Calculate totals with real prices
    subtotal = sum(item.price * item.quantity for item in order_data.items)
    
    # Calculate real shipping cost based on country
    shipping_cost = calculate_shipping_cost(order_data.country)
    
    # No tax for international orders
    tax_amount = 0.0
    total_amount = subtotal + shipping_cost + tax_amount
    
    # Create order
    db_order = Order(
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        address_line1=order_data.address_line1,
        address_line2=order_data.address_line2,
        city=order_data.city,
        state=order_data.state,
        postal_code=order_data.postal_code,
        country=order_data.country,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        tax_amount=tax_amount,
        total_amount=total_amount,
        payment_intent_id=order_data.payment_intent_id,
        payment_status="pending"
    )
    
    db.add(db_order)
    db.flush()
    
    # Create order items
    for item in order_data.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_type=item.product_type,
            color=item.color,
            color_name=item.color_name,
            size=item.size,
            quantity=item.quantity,
            unit_price=item.price,
            total_price=item.price * item.quantity,
            # product_images=json.dumps(item.images) if item.images else None
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    
    # Comment out e-shipper for now
    # send_order_to_eshipper(db_order)
    
    return db_order

# Keep the other functions but remove customer-related ones
def get_order(db: Session, order_id: int) -> Order:
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_email(db: Session, email: str):
    return db.query(Order).filter(Order.customer_email == email).all()