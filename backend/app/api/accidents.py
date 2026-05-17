from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from services.accident_service import get_all_accidents, get_accident_by_id
from schemas.accident import AccidentResponse, AccidentList

router = APIRouter(prefix='/api/v1', tags=['accidents'])

@router.get('/accidents', response_model=AccidentList)
def get_accidents(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Accidents per page"),
    db: Session = Depends(get_db)
):

    total, items = get_all_accidents(db, page, page_size)

    return AccidentList(
        total=total,
        page=page, 
        page_size=page_size,
        items=items
    )

@router.get('/accident/{accident_id}', response_model=AccidentResponse)
def get_accident(
    accident_id: int,
    db: Session = Depends(get_db)
):

    accident = get_accident_by_id(db, accident_id)

    if accident is None:
        raise HTTPException(status_code=404, detail=f"Accident with ID {accident_id} not found.")
    
    return accident
