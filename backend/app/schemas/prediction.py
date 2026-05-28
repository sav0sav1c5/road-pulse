from datetime import datetime
from pydantic import BaseModel

class PredictionRequest(BaseModel):
    municipality: str
    date_time: datetime
    involved_vehicles_num: str
    longitude: float
    latitude: float

class PredictionResponse(BaseModel):
    severity: str
    probability: float