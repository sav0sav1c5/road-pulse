from fastapi import FastAPI, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from db.database import engine, get_db, Base
from models.accident import Accident
from schemas.accident import AccidentResponse, AccidentList

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Road Pulse API', version='1.0')

@app.get('/accidents', response_model=AccidentList)
def get_accidents(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Accidents per page"),
    db: Session = Depends(get_db)
    ):

    # Calculate from which row starts
    offset = (page - 1) * page_size
    
    # Find all accidents and take one page of results
    total = db.query(Accident).count()
    items = db.query(Accident).offset(offset).limit(page_size).all()

    return AccidentList(
        total=total,
        page=page,
        page_size=page_size,
        items=items  
    )

@app.get('/accident/{accident_id}', response_model=AccidentResponse)
def get_accident(
    accident_id: int,
    db: Session = Depends(get_db)
    ):
    
    # Find first accident with passed 'accident_id'
    accident = db.query(Accident).filter(Accident.accident_id == accident_id).first()

    # Not Found - return status 404
    if accident is None:
        raise HTTPException(status_code=404, detail="Accident with this ID not found.")

    return accident