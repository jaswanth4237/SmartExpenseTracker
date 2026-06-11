# Smart Expense Tracker

A full-stack mobile expense tracker with on-device ML receipt scanning.

## Features
- **On-Device OCR**: Uses Google ML Kit for privacy and speed.
- **Heuristic Parsing**: Custom engine extracts merchant, date, total, and items.
- **Confidence Scoring**: Highlights fields that may need manual review.
- **FastAPI Backend**: Robust API for storage and reporting.
- **Dockerized**: Easy setup with Docker Compose.

## Project Structure
- `backend/`: FastAPI application.
- `mobile/`: React Native (Expo) application.
- `tests/`: Automated tests for the parsing engine.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for mobile tests)

### Running the Backend
1. Create a `.env` file based on `.env.example`.
2. Run `docker-compose up --build`.
3. The API will be available at `http://localhost:8000`.
4. Health check: `curl http://localhost:8000/health`.

### Running Tests
To verify the parsing engine logic:
```bash
npm install jest --save-dev
npm test
```
(Note: Tests are located in `tests/parser.test.js`)

## API Endpoints
- `POST /expenses`: Create a new expense (with category inference).
- `GET /expenses`: List all expenses.
- `GET /expenses/summary?month=YYYY-MM`: Get monthly summary by category.
- `GET /expenses/export?month=YYYY-MM`: Export monthly expenses as CSV.

## Implementation Details
- **OCR**: Performed on-device using `@react-native-ml-kit/text-recognition`.
- **Parsing**: Layered approach using Regex and Heuristics in `mobile/src/utils/parser.js`.
- **UI**: Camera overlay with 1.585 aspect ratio guide built with `react-native-svg`.
- **Containerization**: Includes health checks and service dependencies.
