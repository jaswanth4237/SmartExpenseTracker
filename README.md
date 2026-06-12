# Smart Expense Tracker 🚀

A full-stack, privacy-first mobile application designed to simplify expense tracking through on-device Machine Learning (ML) and intelligent receipt parsing.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React Native](https://img.shields.io/badge/Mobile-React_Native-61DAFB)

## 🌟 Key Features

- **On-Device OCR**: Utilizing Google ML Kit to extract text from receipts locally. No images are sent to the cloud, ensuring maximum privacy.
- **Intelligent Heuristic Parsing**: A custom-built engine uses Regex and heuristics to extract merchant names, dates, line items, and totals with high accuracy.
- **Confidence Scoring**: Automatically flags fields (like Merchant or Total) that might need manual verification based on parsing certainty.
- **Category Inference**: Automatically assigns categories (Groceries, Food, Coffee, etc.) based on merchant keywords.
- **Monthly Reporting**: Generate detailed summaries by category and export data as CSV for accounting.
- **Offline-Ready Architecture**: Process and review expenses on-device before syncing to the cloud.

---

## 🛠️ Tech Stack

- **Mobile**: React Native (Expo SDK 51), `expo-camera`, `react-native-svg`.
- **OCR Engine**: `@react-native-ml-kit/text-recognition`.
- **Backend**: Python (FastAPI), SQLAlchemy ORM.
- **Database**: PostgreSQL (Production/Docker) or SQLite (Local Development).
- **Containerization**: Docker & Docker Compose.
- **Testing**: Jest (for parsing logic verification).

---

## 📂 Project Structure

```text
SmartExpenseTracker/
├── backend/            # FastAPI Application
│   ├── main.py         # API Endpoints & Logic
│   ├── models.py       # SQLAlchemy Database Models
│   ├── schemas.py      # Pydantic Data Validation
│   └── database.py     # Database Connection
├── mobile/             # React Native (Expo) Application
│   ├── App.js          # Main Application Flow
│   ├── src/
│   │   ├── screens/    # UI Screens (Camera, Form)
│   │   └── utils/      # Parsing Engine (parser.js)
├── tests/              # Automated Test Suite
└── docker-compose.yml  # Orchestration Config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker Desktop (Optional but recommended)

### 1. Backend Setup
Choose one of the following methods to start the backend:

#### Option A: Local (SQLite)
1. Navigate to backend: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Start server: `uvicorn main:app --reload --port 8000`

#### Option B: Docker (PostgreSQL)
1. Run `docker-compose up --build` from the root directory.

### 2. Mobile Setup
1. Navigate to mobile: `cd mobile`
2. Install dependencies: `npm install`
3. **Update IP Address**: Open `App.js` and update `BACKEND_URL` with your computer's local IP (e.g., `http://192.168.1.XX:8000`).
4. Start Expo: `npx expo start --host lan`
5. Scan the QR code with the **Expo Go** app on your phone.

---

## 📊 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/expenses` | Create a new expense with category inference. |
| `GET` | `/expenses` | Retrieve all recorded expenses. |
| `GET` | `/expenses/summary` | Get monthly spending totals by category. |
| `GET` | `/expenses/export` | Download a CSV file of monthly expenses. |
| `GET` | `/health` | Verify API and Database status. |

---

## 🧪 Testing the Parser
The core logic resides in `mobile/src/utils/parser.js`. To verify it against mock receipts:
```bash
npm test
```
*Tested formats include: McDonald's, Walmart, Starbucks, Shell, and common restaurant receipts.*

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ for better personal finance.
