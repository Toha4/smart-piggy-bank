from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Схемы для целей
class GoalBase(BaseModel):
    title: str
    target_amount: float
    target_date: Optional[datetime] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = None
    target_date: Optional[datetime] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class GoalResponse(GoalBase):
    id: int
    current_balance: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Схемы для транзакций
class TransactionBase(BaseModel):
    goal_id: int
    amount: float
    transaction_type: str # "deposit" или "withdrawal"
    description: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    transaction_type: Optional[str] = None
    description: Optional[str] = None


class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Схемы для настроек
class SettingsBase(BaseModel):
    theme: Optional[str] = None


class SettingsUpdate(SettingsBase):
    pass


class SettingsResponse(BaseModel):
    id: int
    theme: str
    currency: str
    language: str
    created_at: datetime
    updated_at: datetime


    class Config:
        from_attributes = True