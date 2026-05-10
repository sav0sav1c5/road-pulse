import pandas as pd
from  models.accident import Accident

RAW_PATH = "data/raw/nez-opendata-202.xlsx"

def add_columns(data):
    data.columns = ['accident_id', 'department', 'municipality', 'date_time', 'longitude', 'latitude', 'accident_type', 'involved_vehicles_num', 'description']

    return data

def import_raw_data():
    imported_data = []

    for i in range(7):
        data = pd.read_excel(f"../../data/raw/nez-opendata-202{i}.xlsx")
        data = add_columns(data)

        # Date and Time parsing
        data['date_time'] = pd.to_datetime(
            data['date_time'],
            format = "%d.%m.%Y,%H:%M",
            errors = "coerce"
        )

        imported_data.append(data)
        print(data.columns)

    return pd.concat(imported_data, ignore_index=True)

def load_database(session):

    data = import_raw_data()

    data = data.drop_duplicates(subset=['accident_id'])


    for index, row in data.iterrows():
        
        accident = Accident(
            accident_id = row['accident_id'],
            department = row['department'],
            municipality = row['municipality'],
            date_time = row['date_time'],
            longitude = row['longitude'],
            latitude = row['latitude'],
            accident_type = row['accident_type'],
            involved_vehicles_num = row['involved_vehicles_num'],
            description = row['description']
        )
        
        session.add(accident)

    session.commit()

    print("Database loaded successfully!")