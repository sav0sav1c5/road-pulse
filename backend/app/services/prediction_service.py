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

rf_model = joblib.load('models/rf_model_final.pkl')
le_municipality = joblib.load('models/encoders/le_municipality.pkl')
le_description = joblib.load('models/encoders/le_description.pkl')

THRESHOLD = 0.45

from scripts.preprocess import preprocess

FEATURES = [
    'municipality_encoded', 'month', 'day_of_week', 'hour', 'acc_parked_vehicles',
    'acc_pedestrians', 'acc_single_vehicle', 'acc_two_vehicles_no_turn',
    'acc_two_vehicles_turn_or_cross', 'description_encoded'
]

def predict_severity(
    municipality: str,
    description: str,
    involved_vehicles_num: str,
    date_time: str
) -> dict:
    
    # Make dataframe
    df = pd.DataFrame([{
        'municipality': municipality,
        'description': description,
        'involved_vehicles_num': involved_vehicles_num,
        'date_time': pd.to_datetime(date_time)
    }])

    # 2. Preprocess data
    df = preprocess(df, le_municipality, le_description)

    # Add missing one-hot columns
    for col in FEATURES:
        if col not in df.columns:
            df[col] = 0

    # Select columns that model will use
    X = df[FEATURES]

    # Predict accident severity
    probability = rf_model.predict_proba(X)[0][1]
    prediction = int(probability >= THRESHOLD)

    # Probability percentage
    # probability = round(probability * 100, 2)

    return {
        "severity": "Injured/Dead" if prediction == 1 else "Material",
        "probability": round(float(probability), 4)
    }

# if __name__ == "__main__":
#     result = predict_severity(
#         municipality="BARAJEVO",
#         description="Nezgoda sa jednim vozilom – silazak sa kolovoza u krivini",
#         involved_vehicles_num="SN SA JEDNIM VOZILOM",
#         date_time="2024-03-15 17:30:00"
#     )
#     print(result)