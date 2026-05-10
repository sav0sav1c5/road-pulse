import pandas as pd

RAW_PATH = "data/raw/nez-opendata-202.xlsx"

def add_columns(data):
    data.columns = ['accident_id', 'department', 'municipality', 'date_time', 'longitude', 'latitude', 'accident_type', 'involved_vehicles_num', 'description']

    return data

def import_raw_data():
    imported_data = []

    for i in range(7):
        data = pd.read_excel(f"../../data/raw/nez-opendata-202{i}.xlsx")
        data = add_columns(data)
        imported_data.append(data)
        print(data.columns)

    return pd.concat(imported_data, ignore_index=True)

def load_database():

    pass