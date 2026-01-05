from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
from models import Settings
from routers import goal, transaction, settings
from sqlalchemy.orm import Session

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Piggy Bank API", version="1.0.0")

# Убедимся, что запись настроек по умолчанию существует
def create_default_settings(db: Session):
    existing_settings = db.query(Settings).first()
    if not existing_settings:
        default_settings = Settings(theme="light", currency="RUB", language="ru")
        db.add(default_settings)
        db.commit()
        db.refresh(default_settings)

@app.on_event("startup")
def startup_event():
    # Создаем таблицы и добавляем настройки по умолчанию при запуске
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        create_default_settings(db)
    finally:
        db.close()

# Настройка CORS для разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене нужно указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(goal.router, prefix="/goals", tags=["goals"])
app.include_router(transaction.router, prefix="/transactions", tags=["transactions"])
app.include_router(settings.router, prefix="/settings", tags=["settings"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)