from pydantic import BaseModel
from datetime import datetime
from typing import List

class AccidentResponse(BaseModel):
    id: int
    accident_id: int
    department: str
    municipality: str
    date_time: datetime
    longitude: float
    latitude: float
    accident_type: str
    involved_vehicles_num: str
    description: str

    class Config:
        from_attributes = True

class AccidentList(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[AccidentResponse]

# Universal statistics classes

class StatsItem(BaseModel):
    label: str
    count: int

class StatsList(BaseModel):
    total_items: int
    items: List[StatsItem]

# Map point classes

class MapPoint(BaseModel):
    accident_id: int
    latitude: float
    longitude: float
    accident_type: str
    municipality: str
    date_time: datetime

    class Config:
        from_attributes = True

class MapPointList(BaseModel):
    total: int
    items: List[MapPoint]