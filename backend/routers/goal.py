from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Goal, Transaction
from schemas import GoalResponse, GoalCreate, GoalUpdate
from database import get_db

router = APIRouter()

def recalculate_goal_balance(db: Session, goal_id: int):
    """Пересчитывает current_balance для цели на основе транзакций"""
    total_deposits = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.goal_id == goal_id,
        Transaction.transaction_type == "deposit"
    ).scalar()
    
    total_withdrawals = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.goal_id == goal_id,
        Transaction.transaction_type == "withdrawal"
    ).scalar()
    
    balance = total_deposits - total_withdrawals
    
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if goal:
        goal.current_balance = balance
        db.commit()
        db.refresh(goal)
    
    return goal

@router.get("/", response_model=list[GoalResponse])
def get_goals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    goals = db.query(Goal).offset(skip).limit(limit).all()
    return goals

@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal_by_id(goal_id: int, db: Session = Depends(get_db)):
    db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return db_goal

@router.post("/", response_model=GoalResponse)
def create_goal(goal_create: GoalCreate, db: Session = Depends(get_db)):
    db_goal = Goal(**goal_create.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, goal_update: GoalUpdate, db: Session = Depends(get_db)):
    db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Обновляем поля, которые были переданы
    for field, value in goal_update.dict(exclude_unset=True).items():
        setattr(db_goal, field, value)
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(db_goal)
    db.commit()
    
    return {"message": "Goal deleted successfully"}