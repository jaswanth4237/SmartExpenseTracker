import csv
from datetime import date
from io import StringIO
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import extract, func

import models, schemas
from database import engine, Base, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Category inference mappings
CATEGORY_MAPPINGS = {
    "walmart": "Groceries",
    "mcdonald": "Food",
    "starbucks": "Coffee",
    "shell": "Gas",
    "amazon": "Shopping",
    "target": "Groceries",
    "uber": "Transport",
}

def infer_category(merchant_name: str) -> str:
    merchant_lower = merchant_name.lower()
    for keyword, cat in CATEGORY_MAPPINGS.items():
        if keyword in merchant_lower:
            return cat
    return "Miscellaneous"

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/expenses", response_model=schemas.Expense, status_code=201)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    category = infer_category(expense.merchant)
    
    db_expense = models.Expense(
        merchant=expense.merchant,
        purchase_date=expense.purchase_date,
        total=expense.total,
        tax=expense.tax,
        category=category
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    for item in expense.line_items:
        db_item = models.LineItem(**item.model_dump(), expense_id=db_expense.id)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/expenses", response_model=List[schemas.Expense])
def read_expenses(db: Session = Depends(get_db)):
    return db.query(models.Expense).all()

@app.get("/expenses/summary", response_model=schemas.CategorySummary)
def get_summary(month: str = Query(..., regex=r"^\d{4}-\d{2}$"), db: Session = Depends(get_db)):
    year, mon = map(int, month.split("-"))
    
    expenses = db.query(models.Expense).filter(
        extract('year', models.Expense.purchase_date) == year,
        extract('month', models.Expense.purchase_date) == mon
    ).all()
    
    total = sum(e.total for e in expenses)
    cat_summary = {}
    for e in expenses:
        cat_summary[e.category] = cat_summary.get(e.category, 0.0) + e.total
        
    return {
        "month": month,
        "total_expenses": total,
        "category_summary": cat_summary
    }

@app.get("/expenses/export")
def export_expenses(month: str = Query(..., regex=r"^\d{4}-\d{2}$"), db: Session = Depends(get_db)):
    year, mon = map(int, month.split("-"))
    
    expenses = db.query(models.Expense).filter(
        extract('year', models.Expense.purchase_date) == year,
        extract('month', models.Expense.purchase_date) == mon
    ).all()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "date", "merchant", "category", "total", "tax"])
    
    for e in expenses:
        writer.writerow([e.id, e.purchase_date, e.merchant, e.category, e.total, e.tax])
    
    output.seek(0)
    
    headers = {
        "Content-Disposition": f'attachment; filename="expenses_{month}.csv"'
    }
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers=headers)
