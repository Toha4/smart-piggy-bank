# Smart Piggy Bank Backend

Backend-часть приложения "Smart Piggy Bank" на FastAPI с SQLAlchemy и SQLite.

## Структура проекта

```
backend/
├── main.py          # Точка входа FastAPI-приложения
├── models.py        # SQLAlchemy модели для целей, транзакций и настроек
├── schemas.py       # Pydantic схемы для валидации данных
├── database.py      # Настройки подключения к БД и сессии SQLAlchemy
├── routers/         # Роутеры API
│   ├── goal.py      # Роутер для работы с целями
│   ├── transaction.py # Роутер для работы с транзакциями
│   └── settings.py  # Роутер для работы с настройками
├── requirements.txt # Зависимости проекта
└── test_api.py      # Скрипт для тестирования API
```

## API Эндпоинты

### Цели

- `GET /api/goal` - получить список целей
- `POST /api/goal` - создать новую цель
- `PUT /api/goal/{goal_id}` - обновить цель

### Транзакции

- `GET /api/transactions` - получить список транзакций
- `POST /api/transactions` - создать новую транзакцию
- `PUT /api/transactions/{transaction_id}` - обновить транзакцию
- `DELETE /api/transactions/{transaction_id}` - удалить транзакцию

### Настройки

- `GET /api/settings/theme` - получить настройки темы
- `PUT /api/settings/theme` - обновить настройки темы

## Запуск приложения

### Локальный запуск

1. Установите зависимости:
```bash
pip install -r requirements.txt
```

2. Запустите приложение:
```bash
python -m uvicorn backend.main:app --reload
```

Приложение будет доступно по адресу `http://localhost:8000`.

### Запуск с Docker

1. Соберите и запустите контейнеры:
```bash
docker-compose up --build
```

Backend будет доступен по адресу `http://localhost:8000`.

## Тестирование API

Для тестирования API можно использовать скрипт `test_api.py`:

```bash
python test_api.py
```

Этот скрипт выполнит серию запросов к API и проверит работоспособность всех эндпоинтов.

## Особенности реализации

- Автоматический пересчет `current_balance` цели при добавлении/удалении/обновлении транзакций
- Валидация данных с помощью Pydantic-схем
- Обработка ошибок (например, при попытке создать транзакцию для несуществующей цели)
- Поддержка CORS для кросс-доменных запросов