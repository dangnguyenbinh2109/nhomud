# infrastructure/repositories/order_repository.py
from sqlalchemy.orm import Session
from infrastructure.models.order_model import OrderModel
from domain.models.order import Order
from datetime import datetime
from typing import Optional

class OrderRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_all(self):
        return self.db_session.query(OrderModel).all()

    def get_by_id(self, order_id: int) -> Optional[OrderModel]:
        return self.db_session.query(OrderModel).filter_by(order_id=order_id).first()

    def create(self, order: Order) -> OrderModel:
        order_model = OrderModel(
            user_id=order.user_id,
            package_id=order.package_id,
            status=order.status,
            created_at=order.created_at,
            paid_at=order.paid_at
        )
        self.db_session.add(order_model)
        self.db_session.commit()
        self.db_session.refresh(order_model)
        return order_model

    def update_status(self, order_id: int, status: str) -> Optional[OrderModel]:
        order = self.get_by_id(order_id)
        if not order:
            return None
        order.status = status
        if status == "paid":
            order.paid_at = datetime.utcnow()
        self.db_session.commit()
        return order
