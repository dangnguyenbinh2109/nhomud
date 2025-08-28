from datetime import datetime, timedelta
from typing import List, Optional
from domain.models.order import Order
from domain.models.user_subscription import UserSubscription
from infrastructure.repositories.order_repository import OrderRepository
from infrastructure.repositories.user_subscription_repository import UserSubscriptionRepository
from infrastructure.models.package_model import PackageModel
from infrastructure.databases.mssql import session

class OrderService:
    def __init__(self, order_repo: OrderRepository, subscription_repo: UserSubscriptionRepository):
        self.order_repo = order_repo
        self.subscription_repo = subscription_repo

    # -------------------------------
    # User đặt order
    # -------------------------------
    def create_order(self, user_id: int, package_id: int) -> Order:
        new_order = Order(
            order_id=None,
            user_id=user_id,
            package_id=package_id,
            status="pending",
            created_at=datetime.utcnow(),
            paid_at=None
        )
        order_model = self.order_repo.create(new_order)
        return Order(
            order_id=order_model.order_id,
            user_id=order_model.user_id,
            package_id=order_model.package_id,
            status=order_model.status,
            created_at=order_model.created_at,
            paid_at=order_model.paid_at
        )

    # -------------------------------
    # Lấy danh sách order
    # -------------------------------
    def list_orders(self) -> List[Order]:
        orders = self.order_repo.get_all()
        return [
            Order(
                order_id=o.order_id,
                user_id=o.user_id,
                package_id=o.package_id,
                status=o.status,
                created_at=o.created_at,
                paid_at=o.paid_at
            )
            for o in orders
        ]

    # -------------------------------
    # Approve order (Admin)
    # -------------------------------
    def approve_order(self, order_id: int) -> Optional[Order]:
        order_model = self.order_repo.update_status(order_id, "paid")
        if not order_model:
            return None

        # Lấy package để tính end_date
        package = session.query(PackageModel).filter_by(package_id=order_model.package_id).first()
        subscription = None
        if package:
            start_date = datetime.utcnow()
            end_date = start_date + timedelta(days=package.duration_days)

            subscription = UserSubscription(
                subscription_id=None,
                user_id=order_model.user_id,
                package_id=order_model.package_id,
                start_date=start_date,
                end_date=end_date
            )
            created_sub = self.subscription_repo.create(subscription)
            subscription.subscription_id = created_sub.subscription_id

        return Order(
            order_id=order_model.order_id,
            user_id=order_model.user_id,
            package_id=order_model.package_id,
            status=order_model.status,
            created_at=order_model.created_at,
            paid_at=order_model.paid_at,
            subscription=subscription  # ✅ thêm vào domain
        )

    # -------------------------------
    # Cancel order
    # -------------------------------
    def cancel_order(self, order_id: int) -> Optional[Order]:
        order_model = self.order_repo.update_status(order_id, "cancelled")
        if not order_model:
            return None
        return Order(
            order_id=order_model.order_id,
            user_id=order_model.user_id,
            package_id=order_model.package_id,
            status=order_model.status,
            created_at=order_model.created_at,
            paid_at=order_model.paid_at
        )
