from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from backend.app.models.accident import Accident

# Get accidents with pagination
def get_all_accidents(db: Session, page: int, page_size: int):

    offset = (page - 1) * page_size

    total = db.query(Accident).count()
    items = db.query(Accident).offset(offset).limit(page_size).all()

    return total, items

# Get accident by ID
def get_accident_by_id(db: Session, accident_id: int):

    return db.query(Accident).filter(Accident.accident_id == accident_id).first()

# Get accident stats by police deparment
def get_stats_by_department(db: Session):
    
    rows = (
        db.query(Accident.department, func.count(Accident.id).label('count'))
        .group_by(Accident.department)
        .order_by(func.count(Accident.id).desc())
        .all()
    )

    return [{'label': row.department, 'count': row.count} for row in rows]

# Get accident stats by hour
def get_stats_by_hour(db: Session):
    
    rows = (
        db.query(extract('hour', Accident.date_time).label('hour'), func.count(Accident.id).label('count'))
        .group_by('hour')
        .order_by(func.count(Accident.id).desc())
        .all()
    )

    return [{'label': str(int(row.hour)), 'count': row.count} for row in rows]

# Get accident stats by year
def get_stats_by_year(db: Session):
    
    rows = ()

    return rows

# Get accident stats by accident type
def get_stats_by_accident_type():
    
    rows = ()

    return rows