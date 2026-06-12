# Complete Run Guide: Smart Expense Tracker

This guide provides step-by-step instructions to get the full-stack Smart Expense Tracker app running on your machine and physical device.

---

## 1. Backend Setup (FastAPI)

The backend is built with FastAPI and uses SQLAlchemy for database management.

### Option A: Local Run (Quickest)
I have already configured the app to use **SQLite** by default for easier local setup.

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Environment Variables**:
   Ensure you have a `.env` file in the root (I've already created one for you).
3. **Start the Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000`.*

### Option B: Docker Run (Production-like)
1. **Ensure Docker Desktop is running**.
2. **Start Containers**:
   ```bash
   docker-compose up --build
   ```

---

## 2. Mobile App Setup (React Native + Expo)

### Option A: Running on Physical Device (Expo Go)
**Recommended for testing the actual flow.**

1. **Find your Local IP**:
   I have already updated `mobile/App.js` with your current IP: `10.246.19.245`.
2. **Install Mobile Dependencies**:
   ```bash
   cd mobile
   npm install
   ```
3. **Start Expo**:
   ```bash
   npx expo start --host lan
   ```
4. **Scan QR Code**:
   Open the **Expo Go** app on your phone and scan the QR code displayed in your terminal.
   *Note: Ensure your phone and PC are on the same Wi-Fi.*

### Option B: Running in Web Browser
1. **Install Web Support**:
   I have already installed `react-native-web` and `react-dom` for you.
2. **Start Web Bundle**:
   ```bash
   cd mobile
   npx expo start --web
   ```
   *Current web port is `8085`.*

---

## 3. Verifying the Logic (Tests)

We use **Jest** to test the heuristic parsing engine that extracts data from receipts.

1. **Run All Tests**:
   ```bash
   npm test
   ```
   *Tests are located in `tests/parser.test.js` and cover multiple receipt formats (McDonald's, Walmart, Starbucks, etc.).*

---

## 4. Key Endpoints
* **Health Check**: `GET http://localhost:8000/health`
* **Expense Listing**: `GET http://localhost:8000/expenses`
* **Monthly Summary**: `GET http://localhost:8000/expenses/summary?month=2026-06`
* **Export CSV**: `GET http://localhost:8000/expenses/export?month=2026-06`

---

## Troubleshooting
* **Blank Screen on Web**: This was fixed by correcting the entry point in `package.json` to `node_modules/expo/AppEntry.js`.
* **OCR Not Working**: OCR requires a native environment. If you use Expo Go, you will see a "Simulate Scan" button in Web mode or a mock fallback to prevent crashes.
* **Backend Connection Failed**: Double check that `BACKEND_URL` in `App.js` matches your computer's current IP address (use `ipconfig`).
