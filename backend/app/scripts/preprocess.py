import numpy as np
import pandas as pd

def _get_season(month):
    if month in [12, 1, 2]:
        return 0
    if month in [3, 4, 5]:
        return 1
    if month in [6, 7, 8]:
        return 2
    else:
        return 3

def _extract_datetime_features(df):
    df['year'] = df['date_time'].dt.year
    df['month'] = df['date_time'].dt.month
    df['day_of_week'] = df['date_time'].dt.dayofweek
    df['hour'] = df['date_time'].dt.hour
    df['day_type'] = np.where((df['day_of_week'] == 5) | (df['day_of_week'] == 6), 1, 0)
    df['season'] = df['month'].apply(_get_season)
    df['is_rush'] = df['hour'].isin([7, 8, 16, 17, 18]).astype(int)
    df['is_night'] = (df['hour'].between(22, 23) | df['hour'].between(0, 6)).astype(int)

    df = df.drop(columns='date_time')

    return df

def _encode_involved_vehicles(df):
    mapping = {
        r'SN SA JEDNIM VOZILOM': 'single_vehicle',
        r'SN SA NAJMANjE DVA VOZILA – BEZ SKRETANjA': 'two_vehicles_no_turn',
        r'SN SA NAJMANjE DVA VOZILA – SKRETANjE ILI PRELAZAK': 'two_vehicles_turn_or_cross',
        r'SN SA PARKIRANIM VOZILIMA': 'parked_vehicles',
        r'SN SA PEŠACIMA': 'pedestrians' 
    }

    df['involved_vehicles_num'] = df['involved_vehicles_num'].astype(str).str.strip().replace(mapping, regex=True)

    dummies = pd.get_dummies(df['involved_vehicles_num'], prefix='acc', dtype=int)

    df = pd.concat([df, dummies], axis=1)

    df = df.drop(columns='involved_vehicles_num')

    return df

def _drop_unused_columns(df):
    columns = ['accident_id', 'department', 'year', 'description', 'accident_type']
    
    df = df.drop(columns=columns, errors='ignore')

    return df

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df = _extract_datetime_features(df)
    df = _encode_involved_vehicles(df)
    df = _drop_unused_columns(df)

    return df