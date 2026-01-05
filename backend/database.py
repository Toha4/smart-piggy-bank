from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Получаем путь к базе данных из переменной окружения или используем локальный файл
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smart_piggy_bank.db")

# Создаем движок для SQLite
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Создаем сессию для взаимодействия с БД
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()

# Функция для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()