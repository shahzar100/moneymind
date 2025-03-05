import os
from datetime import datetime
from typing import List, Optional

import pandas as pd
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Configure allowed origins
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:3000",  # Adjust as needed
]

app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic model for a transaction.
class Transaction(BaseModel):
    date: str  # Expected format "dd/mm/yyyy"
    type: str
    name: str
    amount: float
    notes: Optional[str] = None
    category: str


# Pydantic model for the analysis result.
class AnalysisResult(BaseModel):
    insights: str


def parse_date(date_str: str) -> datetime:
    try:
        return datetime.strptime(date_str, "%d/%m/%Y")
    except Exception as e:
        raise ValueError("Date format error. Use dd/mm/yyyy.") from e


@app.get("/")
async def root():
    return {"message": "Welcome to the Spending Analysis API"}


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_transactions(transactions: List[Transaction]):
    # --- Analyze the Selected Period ---
    df_selected = pd.DataFrame([tx.dict() for tx in transactions])
    try:
        df_selected['date'] = pd.to_datetime(df_selected['date'], format="%d/%m/%Y")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Date format error in selected data. Use dd/mm/yyyy.")

    # Filter out rows with category "income" or "transfers" (case-insensitive).
    df_selected = df_selected[~df_selected['category'].str.lower().isin(["income", "transfers"])]
    if df_selected.empty:
        return AnalysisResult(insights="It looks like there's no spending data for the selected period.")

    df_selected['amount_abs'] = df_selected['amount'].abs()
    total_selected = df_selected['amount_abs'].sum()
    start_date = df_selected['date'].min()
    end_date = df_selected['date'].max()
    period_days = (end_date - start_date).days + 1

    # Identify the largest expense.
    idx_max = df_selected['amount_abs'].idxmax()
    largest_tx = df_selected.loc[idx_max]
    largest_value = largest_tx['amount_abs']
    largest_name = largest_tx['name']
    largest_date = largest_tx['date'].strftime("%d/%m/%Y")

    # --- Analyze the Full Dataset ---
    full_data_path = os.path.join(os.getcwd(), "..", "..", "public", "data.csv")
    if not os.path.exists(full_data_path):
        raise HTTPException(status_code=500, detail="Full dataset not found.")

    try:
        df_full = pd.read_csv(full_data_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading full dataset: {str(e)}")

    try:
        df_full['date'] = pd.to_datetime(df_full['Date'], format="%d/%m/%Y")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Date format error in full dataset. Use dd/mm/yyyy.")

    today = pd.Timestamp.today()
    ninety_days_ago = today - pd.Timedelta(days=90)
    df_full = df_full[(df_full['date'] >= ninety_days_ago) & (df_full['date'] <= today)]
    df_full = df_full[~df_full['Category'].str.lower().isin(["income", "transfers"])]

    if df_full.empty:
        overall_avg_daily = 0.0
    else:
        try:
            df_full['amount_abs'] = df_full['Local amount'].abs()
        except Exception as e:
            raise HTTPException(status_code=400, detail="Column 'Local amount' missing or invalid in full dataset.")
        total_full = df_full['amount_abs'].sum()
        overall_avg_daily = total_full / 90

    expected_spending = overall_avg_daily * period_days
    diff_percentage = ((total_selected - expected_spending) / expected_spending * 100) if expected_spending > 0 else 0.0

    # --- Build the Human-Readable Insights ---
    insights = (
        f"Hi there! Over the last {period_days} days (from {start_date.strftime('%d/%m/%Y')} to "
        f"{end_date.strftime('%d/%m/%Y')}), you spent a total of £{total_selected:.2f}. "
        f"Based on your spending over the past 90 days, your average daily spend is about £{overall_avg_daily:.2f}, "
        f"which means you'd normally spend around £{expected_spending:.2f} in a similar period. "
        f"This is a {abs(diff_percentage):.1f}% {'increase' if diff_percentage > 0 else 'decrease'} from your usual spending. "
        f"Also, your largest expense during this period was '{largest_name}', costing £{largest_value:.2f} on {largest_date}. "
        f"Keep tracking your spending to see where you can save more!"
    )

    return AnalysisResult(insights=insights)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
