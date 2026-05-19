from datetime import datetime
from pydantic import BaseModel

class PredictionRequest(BaseModel):
    municipality: str
    date_time: datetime
    involved_vehicles_num: str
    description: str

class PredictionResponse(BaseModel):
    severity: str
    probability: str