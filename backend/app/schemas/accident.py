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