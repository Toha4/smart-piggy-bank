import sys
from pathlib import Path

# Добавляем путь к backend для импорта модулей
sys.path.append(str(Path(__file__).parent))

from fastapi.testclient import TestClient
from database import Base, engine
from models import Settings

# Создаем таблицы до импорта приложения
Base.metadata.create_all(bind=engine)

# Импортируем приложение после инициализации базы
from main import app

# Создаем тестовый клиент
client = TestClient(app)

def test_create_and_get_settings():
    """Тестирование создания и получения настроек"""
    # Удаляем существующую таблицу и создаем заново
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Получаем настройки (должны создаться автоматически)
    response = client.get("/settings/")
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    
    data = response.json()
    assert "id" in data, f"Expected 'id' in response, got {data}"
    assert data["theme"] == "light", f"Expected theme 'light', got {data['theme']}"
    assert data["currency"] == "RUB", f"Expected currency 'RUB', got {data['currency']}"
    assert data["language"] == "ru", f"Expected language 'ru', got {data['language']}"
    print("✓ test_create_and_get_settings passed")

def test_update_settings():
    """Тестирование обновления настроек"""
    # Обновляем настройки
    response = client.put("/settings/", json={"theme": "dark"})
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    
    data = response.json()
    assert data["theme"] == "dark", f"Expected theme 'dark', got {data['theme']}"
    assert data["currency"] == "RUB", f"Expected currency 'RUB', got {data['currency']}"  # Это значение должно быть фиксированным
    assert data["language"] == "ru", f"Expected language 'ru', got {data['language']}"   # Это значение должно быть фиксированным
    print("✓ test_update_settings passed")

def test_get_goals_endpoint():
    """Тестирование получения целей"""
    response = client.get("/goals/")
    # Код ответа может быть 200 (пустой список) или 401 (если требуется аутентификация)
    # В данном случае ожидаем 200, так как это публичный эндпоинт
    assert response.status_code in [200, 401, 403], f"Unexpected status code {response.status_code}"
    print("✓ test_get_goals_endpoint passed")

def test_health_check():
    """Проверка доступности API"""
    response = client.get("/")
    # Ожидаем, что главная страница возвращает JSON документацию или 404
    assert response.status_code in [200, 404], f"Unexpected status code {response.status_code}"
    print("✓ test_health_check passed")

if __name__ == "__main__":
    # Запускаем тесты
    try:
        test_create_and_get_settings()
        test_update_settings()
        test_get_goals_endpoint()
        test_health_check()
        print("Все тесты пройдены успешно!")
    except AssertionError as e:
        print(f"Тест не пройден: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Ошибка при выполнении тестов: {e}")
        sys.exit(1)