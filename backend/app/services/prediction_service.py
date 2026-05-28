import joblib
import pandas as pd
import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent.parent.parent
app_root = Path(__file__).parent.parent

sys.path.insert(0, str(app_root))
os.chdir(project_root)

print(f"Working directory: {os.getcwd()}")

xgb_model = joblib.load('models/xgboost_tuned.pkl')
mun_encoder = joblib.load('models/encoders/xgb_mun_target_encoder.pkl')

THRESHOLD = 0.45

from scripts.preprocess import preprocess

FEATURES = [
    'municipality',
    'longitude',
    'latitude',
    'month',
    'day_of_week',
    'hour',
    'day_type',
    'is_rush',
    'is_night',
    'season',
    'acc_parked_vehicles',
    'acc_pedestrians',
    'acc_single_vehicle',
    'acc_two_vehicles_no_turn',
    'acc_two_vehicles_turn_or_cross',
]

def predict_severity(
    municipality: str,
    involved_vehicles_num: str,
    date_time: str,
    longitude: float,
    latitude: float,
) -> dict:
    """
    Predicts accident severity based on context.
 
    Parameters
    ----------
    municipality : p
        The name of the municipality — must match the values rom the training data.
    involved_vehicles_num : p
        One of the five categories of vehicle participation (Serbian markings).
    date_time : p
        Date and time in ISO format, e.g. "2024-03-15 17:30:00".
    longitude : float
        Longitude of the location of the accident.
    latitude : float
        Latitude of the accident location.
 
    Returns
    -------
    dict with keys:
        "severity" – "Injured/Dead" or "Material"
        "probability" – float between 0 and 1
    """

    # Make dataframe
    df = pd.DataFrame([{
        'municipality': municipality,
        'involved_vehicles_num': involved_vehicles_num,
        'date_time': pd.to_datetime(date_time),
        'longitude': longitude,
        'latitude': latitude,
    }])

    # Preprocess data
    df = preprocess(df)

    # Target encoding for municipality feature
    df['municipality'] = mun_encoder.transform(df['municipality'])

    # Add missing one-hot columns
    for col in FEATURES:
        if col not in df.columns:
            df[col] = 0

    # Select columns that model will use
    X = df[FEATURES]

    # Predict accident severity where predict_proba returns [[prob_0, prob_1]]
    # We use [0][1] - prob_1 that probability of Injured/Dead
    probability = xgb_model.predict_proba(X)[0][1]
    prediction = int(probability >= THRESHOLD)

    return {
        "severity": "Injured/Dead" if prediction == 1 else "Material",
        "probability": round(float(probability), 4)
    }