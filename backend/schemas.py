from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class LineItemBase(BaseModel):
    description: str
    price: float

class LineItemCreate(LineItemBase):
    pass

class LineItem(LineItemBase):
    id: int
    expense_id: int

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    merchant: str
    purchase_date: date
    total: float
    tax: Optional[float] = None

class ExpenseCreate(ExpenseBase):
    line_items: List[LineItemCreate]

class Expense(ExpenseBase):
    id: int
    category: str
    line_items: List[LineItem]

    class Config:
        from_attributes = True

class CategorySummary(BaseModel):
    month: str
    total_expenses: float
    category_summary: dict[str, float]
