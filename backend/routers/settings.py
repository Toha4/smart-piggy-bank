from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Settings
from schemas import SettingsResponse, SettingsUpdate
from database import get_db

router = APIRouter()

@router.get("/", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    # Получаем настройки, создаем если не существуют
    settings = db.query(Settings).first()
    if not settings:
        # Создаем настройки по умолчанию
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    # Устанавливаем фиксированные значения для валюты и языка
    settings.currency = "RUB"
    settings.language = "ru"
    
    return settings

@router.put("/", response_model=SettingsResponse)
def update_settings(settings_update: SettingsUpdate, db: Session = Depends(get_db)):
    # Получаем существующие настройки
    settings = db.query(Settings).first()
    if not settings:
        # Создаем настройки по умолчанию, если не существуют
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    # Обновляем поля, которые были переданы (кроме currency и language)
    for field, value in settings_update.dict(exclude_unset=True).items():
        if value is not None and field not in ["currency", "language"]:  # Обновляем только непустые значения и только разрешенные поля
            setattr(settings, field, value)
    
    # Устанавливаем фиксированные значения для валюты и языка
    settings.currency = "RUB"
    settings.language = "ru"
    
    db.commit()
    db.refresh(settings)
    return settings