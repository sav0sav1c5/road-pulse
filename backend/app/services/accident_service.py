from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from backend.app.models.accident import Accident

# Get accidents with pagination
def get_all_accidents(
        db: Session, 
        page: int, 
        page_size: int,
        department: str = None,
        municipality: str = None,
        accident_type: str = None
):

    offset = (page - 1) * page_size
    query = db.query(Accident)

    # Filters
    if department:
        query = query.filter(Accident.department == department)

    if municipality:
        query = query.filter(Accident.municipality == municipality)

    if accident_type:
        query = query.filter(Accident.accident_type == accident_type)

    total = query.count()
    items = query.order_by(Accident.date_time.desc()).offset(offset).limit(page_size).all()

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

# Get accident stats by municipality
def get_stats_by_municipality(db: Session):

    rows = (
        db.query(Accident.municipality, func.count(Accident.id).label('count'))
        .group_by(Accident.municipality)
        .order_by(func.count(Accident.id).desc())
        .all()
    )

    return [{'label': row.municipality, 'count': row.count} for row in rows]

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
    
    rows = (
        db.query(extract('year', Accident.date_time).label('year'), func.count(Accident.id).label('count'))
        .group_by('year')
        .order_by(func.count('year'))
        .all()
    )

    return [{'label': str(int(row.year)), 'count': row.count} for row in rows]

# Get accident stats by accident type
def get_stats_by_accident_type(db: Session):
    
    rows = (
        db.query(Accident.accident_type, func.count(Accident.id).label('count'))
        .group_by(Accident.accident_type)
        .order_by(func.count(Accident.id).desc())
        .all()
    )

    return [{'label': row.accident_type, 'count': row.count} for row in rows]

# Get map points for pins mapping on frontend
def get_map_points(db: Session, accident_type: str = None, municipality: str = None):
    query = db.query(
        Accident.accident_id,
        Accident.latitude,
        Accident.longitude,
        Accident.accident_type,
        Accident.municipality,
        Accident.date_time,
    ).filter(
        Accident.latitude.isnot(None),
        Accident.longitude.isnot(None),
        Accident.latitude.between(42, 47),
        Accident.longitude.between(18, 24),
    )

    if accident_type:
        query = query.filter(Accident.accident_type == accident_type)
    if municipality:
        query = query.filter(Accident.municipality == municipality)

    # Without limit if municipality choosed, else limit 5000 samples
    if municipality or accident_type:
        return query.all()
    else:
        return query.limit(5000).all()