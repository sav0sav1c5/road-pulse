import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Motor koji komunicira sa bacom podataka
engine = create_engine(DATABASE_URL)

# Fabrika koja pravi sesije (jedna sesija - jedna radna jedinica sa bazom)
Session = sessionmaker(bind=engine)

# Klasa koja se nasledjuje da bi pravili modele
# Base = declarative_base()

# with engine.connect() as connection:
#     print("Successfully connected!")

# Funkcija koja za svaki API poziv otvara sesiju ka bazi podataka i zatvara kad se zavrsi
def get_db():
    database = Session()
    try:
        yield database
    finally:
        database.close()