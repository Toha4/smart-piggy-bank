import asyncio
import httpx
import json

async def test_api():
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        print("=== Тестируем API Smart Piggy Bank ===\n")
        
        # 1. Тестируем создание цели
        print("1. Создание цели:")
        goal_data = {
            "title": "Накопить на ноутбук",
            "target_amount": 100000.0,
            "description": "Хочу купить новый ноутбук для работы"
        }
        response = await client.post(f"{base_url}/goals/", json=goal_data)
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            goal = response.json()
            print(f"Создана цель: {goal['title']}, ID: {goal['id']}")
            goal_id = goal['id']
        else:
            print(f"Ошибка: {response.text}")
            return
        print()
        
        # 2. Тестируем получение целей
        print("2. Получение списка целей:")
        response = await client.get(f"{base_url}/goals/")
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            goals = response.json()
            print(f"Найдено целей: {len(goals)}")
            for g in goals:
                print(f"  - {g['title']}: {g['current_balance']}/{g['target_amount']}")
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 3. Тестируем создание транзакции
        print("3. Создание транзакции:")
        transaction_data = {
            "goal_id": goal_id,
            "amount": 25000.0,
            "transaction_type": "deposit",
            "description": "Первый взнос на ноутбук"
        }
        response = await client.post(f"{base_url}/transactions/", json=transaction_data)
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            transaction = response.json()
            print(f"Создана транзакция: {transaction['id']}, сумма: {transaction['amount']}")
            transaction_id = transaction['id']
        else:
            print(f"Ошибка: {response.text}")
            return
        print()
        
        # 4. Тестируем получение транзакций
        print("4. Получение списка транзакций:")
        response = await client.get(f"{base_url}/transactions/")
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            transactions = response.json()
            print(f"Найдено транзакций: {len(transactions)}")
            for t in transactions:
                print(f"  - ID: {t['id']}, цель: {t['goal_id']}, сумма: {t['amount']}")
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 5. Тестируем обновление цели
        print("5. Обновление цели:")
        update_data = {
            "title": "Накопить на MacBook Pro",
            "target_amount": 120000.0
        }
        response = await client.put(f"{base_url}/goals/{goal_id}", json=update_data)
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            updated_goal = response.json()
            print(f"Обновлена цель: {updated_goal['title']}")
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 6. Тестируем обновление транзакции
        print("6. Обновление транзакции:")
        update_transaction_data = {
            "amount": 30000.0,
            "description": "Увеличенный первый взнос на MacBook Pro"
        }
        response = await client.put(f"{base_url}/transactions/{transaction_id}", json=update_transaction_data)
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            updated_transaction = response.json()
            print(f"Обновлена транзакция: ID {updated_transaction['id']}, сумма: {updated_transaction['amount']}")
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 7. Тестируем получение обновленной цели (проверим, изменился ли баланс)
        print("7. Проверка баланса цели после обновления транзакции:")
        response = await client.get(f"{base_url}/goals/")
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            goals = response.json()
            for g in goals:
                if g['id'] == goal_id:
                    print(f"Баланс цели '{g['title']}': {g['current_balance']}/{g['target_amount']}")
                    break
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 8. Тестируем настройки темы
        print("8. Получение настроек темы:")
        response = await client.get(f"{base_url}/settings/")
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            settings = response.json()
            print(f"Текущая тема: {settings['theme']}")
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 9. Тестируем обновление настроек темы
        print("9. Обновление настроек темы:")
        theme_data = {
            "theme": "dark"
        }
        response = await client.put(f"{base_url}/settings/", json=theme_data)
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            updated_settings = response.json()
            print(f"Обновленная тема: {updated_settings['theme']}")
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 10. Тестируем удаление транзакции
        print("10. Удаление транзакции:")
        response = await client.delete(f"{base_url}/transactions/{transaction_id}")
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            print("Транзакция успешно удалена")
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        # 11. Проверяем баланс цели после удаления транзакции
        print("11. Проверка баланса цели после удаления транзакции:")
        response = await client.get(f"{base_url}/goals/")
        print(f"Статус: {response.status_code}")
        if response.status_code == 200:
            goals = response.json()
            for g in goals:
                if g['id'] == goal_id:
                    print(f"Баланс цели '{g['title']}': {g['current_balance']}/{g['target_amount']}")
                    break
        else:
            print(f"Ошибка: {response.text}")
        print()
        
        print("=== Тестирование завершено ===")

if __name__ == "__main__":
    asyncio.run(test_api())