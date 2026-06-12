from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    merchant = Column(String, index=True)
    purchase_date = Column(Date)
    total = Column(Float)
    tax = Column(Float, nullable=True)
    category = Column(String)

    line_items = relationship("LineItem", back_populates="expense", cascade="all, delete-orphan")

class LineItem(Base):
    __tablename__ = "line_items"

    id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    description = Column(String)
    price = Column(Float)

    expense = relationship("Expense", back_populates="line_items")
