import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import scripts.import_data as id
import models.accident as acc

if __name__ == "__main__":

    # Load raw data to dataframe
    # data = id.import_raw_data()

    # Connect with database
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    engine = create_engine(database_url)

    # Creating tables
    acc.Base.metadata.create_all(engine)

    # Creating sesstion for loading of data
    Session = sessionmaker(bind=engine)
    session = Session()

    # Load data in tables
    id.load_database(session)