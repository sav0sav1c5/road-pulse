from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.services.accident_service import get_all_accidents, get_accident_by_id, get_stats_by_department, get_stats_by_municipality, get_stats_by_hour, get_stats_by_year, get_stats_by_accident_type
from backend.app.services.prediction_service import predict_severity
from backend.app.schemas.accident import AccidentResponse, AccidentList, StatsList
from backend.app.schemas.prediction import PredictionRequest, PredictionResponse

router = APIRouter(prefix='/api/v1', tags=['accidents'])

@router.get('/accidents/statistics/department', response_model=StatsList)
def stats_by_department(
    db: Session = Depends(get_db)
):

    items = get_stats_by_department(db)

    return StatsList(total_items=len(items), items=items)

@router.get('/accidents/statistics/municipality', response_model=StatsList)
def stats_by_municipality(
    db: Session = Depends(get_db)
):

    items = get_stats_by_municipality(db)

    return StatsList(total_items=len(items), items=items)

@router.get('/accidents/statistics/year', response_model=StatsList)
def stats_by_year(
    db: Session = Depends(get_db)
):
    
    items = get_stats_by_year(db)

    return StatsList(total_items=len(items), items=items)

@router.get('/accidents/statistics/hour', response_model=StatsList)
def stats_by_hour(
    db: Session = Depends(get_db)
):

    items = get_stats_by_hour(db)

    return StatsList(total_items=len(items), items=items)

@router.get('/accidents/statistics/type', response_model=StatsList)
def stats_by_type(
    db: Session = Depends(get_db)
):
    
    items = get_stats_by_accident_type(db)

    return StatsList(total_items=len(items), items=items)

@router.get('/accidents', response_model=AccidentList)
def get_accidents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    department: str = Query(None),
    municipality: str = Query(None),
    accident_type: str = Query(None),
    db: Session = Depends(get_db)
):

    total, items = get_all_accidents(
        db, page, page_size,
        department=department,
        municipality=municipality,
        accident_type=accident_type
    )

    return AccidentList(
        total=total,
        page=page, 
        page_size=page_size,
        items=items
    )

@router.get('/accidents/{accident_id}', response_model=AccidentResponse)
def get_accident(
    accident_id: int,
    db: Session = Depends(get_db)
):

    accident = get_accident_by_id(db, accident_id)

    if accident is None:
        raise HTTPException(status_code=404, detail=f"Accident with ID {accident_id} not found.")
    
    return accident

@router.post('/predict', response_model=PredictionResponse)
def predict(
    request: PredictionRequest
):
    result = predict_severity(
        municipality=request.municipality,
        description=request.description,
        involved_vehicles_num=request.involved_vehicles_num,
        date_time=request.date_time
    )

    return result