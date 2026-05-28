import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import Session
from app.models.accident import Base, Accident
from app.db.database import engine

import pandas as pd
import glob


def import_excel_data():
    """Load data from Excel files into the database."""
    
    session = Session()

    try:
        # Check if data already exists
        if session.query(Accident).first():
            print("Data already exists in the database. Skipping import.")
            return

        print("Loading Excel files...")
        all_data = []

        # Assuming Excel files are located in data/raw/
        excel_files = glob.glob("data/raw/*.xlsx")

        for file_path in excel_files:
            print(f"  Reading: {file_path}")

            df = pd.read_excel(file_path)

            # Adjust column names based on your file structure
            df.columns = [
                "accident_id",
                "department",
                "municipality",
                "date_time",
                "longitude",
                "latitude",
                "accident_type",
                "involved_vehicles_num",
                "description",
            ]

            df["date_time"] = pd.to_datetime(
                df["date_time"],
                format="%d.%m.%Y,%H:%M",
                errors="coerce",
            )

            all_data.append(df)

        df = pd.concat(all_data, ignore_index=True)

        # Remove duplicate accidents
        df = df.drop_duplicates(subset=["accident_id"])

        print(f"Importing {len(df)} records into the database...")

        for _, row in df.iterrows():
            accident = Accident(
                accident_id=row["accident_id"],
                department=row["department"],
                municipality=row["municipality"],
                date_time=row["date_time"],
                longitude=row["longitude"],
                latitude=row["latitude"],
                accident_type=row["accident_type"],
                involved_vehicles_num=row["involved_vehicles_num"],
                description=row["description"],
            )

            session.add(accident)

        session.commit()

        print(f"Successfully imported {len(df)} records!")

    except Exception as e:
        print(f"Error: {e}")
        session.rollback()

    finally:
        session.close()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    import_excel_data()