FROM python:3.13-slim

WORKDIR /app

COPY requirements-api.txt .
RUN pip install --no-cache-dir -r requirements-api.txt

COPY . .

CMD sh -c "python -m backend.app.init_db && uvicorn backend.app.main:app --host 0.0.0.0 --port 8000"