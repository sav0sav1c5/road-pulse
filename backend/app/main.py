from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.db.database import engine, Base
from backend.app.api.accidents import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Road Pulse API', version='1.0')

# Add all endpoints from router
app.include_router(router=router)

# Using frontend/ files like static files
app.mount('/static', StaticFiles(directory='frontend'), name='static')

# Index (main) page
@app.get('/')
def index():
    return FileResponse("frontend/index.html")

# Health check method
@app.get('/health')
def health_check():
    return {
        "status": "ok",
        "database": "connected"
    }
