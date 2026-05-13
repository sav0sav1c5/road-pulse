from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import engine, get_db, Base
from models.accident import Accident
from schemas.accident import AccidentResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Road Pulse API', version='1.0')

@app.get('/accident/{accident_id}', response_model=AccidentResponse)
def get_accident(accident_id: int, db: Session = Depends(get_db)):
    
    # Find first accident with passed 'accident_id'
    accident = db.query(Accident).filter(Accident.accident_id == accident_id).first()

    # Not Found - return status 404
    if accident is None:
        raise HTTPException(status_code=404, detail="Accident with this ID not found.")

    return accident