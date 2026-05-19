import joblib
import pandas as pd
import os
from pathlib import Path

project_root = Path(__file__).parent.parent.parent.parent
os.chdir(project_root)
print(f"Working directory: {os.getcwd()}")

rf_model = joblib.load('models/rf_model_final.pkl')
le_municipality = joblib.load('models/encoders/le_municipality.pkl')
le_description = joblib.load('models/encoders/le_description.pkl')

def predict_service():

    pass