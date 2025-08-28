from sqlalchemy.orm import Session
from infrastructure.models.user_subscription_model import UserSubscriptionModel
from domain.models.user_subscription import UserSubscription

class UserSubscriptionRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, subscription: UserSubscription) -> UserSubscriptionModel:
        sub_model = UserSubscriptionModel(
            user_id=subscription.user_id,
            package_id=subscription.package_id,
            start_date=subscription.start_date,
            end_date=subscription.end_date
        )
        self.db_session.add(sub_model)
        self.db_session.commit()
        return sub_model

    def get_by_user_id(self, user_id: int):
        return self.db_session.query(UserSubscriptionModel).filter_by(user_id=user_id).all()
