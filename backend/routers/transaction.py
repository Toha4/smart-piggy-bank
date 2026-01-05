from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Transaction, Goal
from schemas import TransactionResponse, TransactionCreate, TransactionUpdate
from database import get_db

router = APIRouter()

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).order_by(Transaction.created_at.desc()).offset(skip).limit(limit).all()
    return transactions

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction_by_id(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@router.post("/", response_model=TransactionResponse)
def create_transaction(transaction_create: TransactionCreate, db: Session = Depends(get_db)):
    # Проверяем, существует ли цель
    goal = db.query(Goal).filter(Goal.id == transaction_create.goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Проверяем, что тип транзакции допустим
    if transaction_create.transaction_type not in ["deposit", "withdrawal"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Use 'deposit' or 'withdrawal'")
    
    db_transaction = Transaction(**transaction_create.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    # Пересчитываем баланс цели
    from .goal import recalculate_goal_balance
    recalculate_goal_balance(db, transaction_create.goal_id)
    
    return db_transaction

@router.put("/transactions/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    db: Session = Depends(get_db)
):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Проверяем, что тип транзакции допустим (если он обновляется)
    if transaction_update.transaction_type and transaction_update.transaction_type not in ["deposit", "withdrawal"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Use 'deposit' or 'withdrawal'")
    
    # Сохраняем старое значение для пересчета баланса
    old_goal_id = db_transaction.goal_id
    
    # Обновляем поля, которые были переданы
    for field, value in transaction_update.dict(exclude_unset=True).items():
        setattr(db_transaction, field, value)
    
    db.commit()
    db.refresh(db_transaction)
    
    # Пересчитываем баланс для старой и новой цели
    from .goal import recalculate_goal_balance
    recalculate_goal_balance(db, old_goal_id)
    
    if old_goal_id != db_transaction.goal_id:
        recalculate_goal_balance(db, db_transaction.goal_id)
    
    return db_transaction

@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Сохраняем ID цели для пересчета баланса
    goal_id = db_transaction.goal_id
    
    db.delete(db_transaction)
    db.commit()
    
    # Пересчитываем баланс цели
    from .goal import recalculate_goal_balance
    recalculate_goal_balance(db, goal_id)
    
    return {"message": "Transaction deleted successfully"}