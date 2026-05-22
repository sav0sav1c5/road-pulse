from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.app.db.database import engine, Base
from backend.app.api.accidents import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Road Pulse API', version='1.0')

# Add all endpoints from router
app.include_router(router=router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_methods=['*'],
    allow_haeders=['*'],
)

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
