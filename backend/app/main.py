from fastapi import FastAPI
from backend.app.db.database import engine, Base
from backend.app.api.accidents import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Road Pulse API', version='1.0')

# Add all endpoints from router
app.include_router(router=router)

# Health check method
@app.get('/health')
def health_check():
    return {
        "status": "ok",
        "database": "connected"
    }
