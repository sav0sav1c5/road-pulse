from sqlalchemy.orm import Session
from models.accident import Accident

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
def get_stats_by_department():
    pass

# Get accident stats by hour
def get_stats_by_hour():
    pass

# Get accident stats by year
def get_stats_by_year():
    pass

# Get accident stats by accident type
def get_stats_by_accident_type():
    pass