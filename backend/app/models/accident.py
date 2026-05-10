from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Integer, Float, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from datetime import datetime

class Base(DeclarativeBase):
    pass

class Accident(Base):

    __tablename__ = "accidents"

    # ID
    id: Mapped[int] = mapped_column(primary_key=True)

    # Accident ID
    accident_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)

    # Police Department
    department: Mapped[str] = mapped_column(String(50), nullable=False)

    # Municipality
    municipality: Mapped[str] = mapped_column(String(50), nullable=False)

    # Date and Time
    date_time: Mapped[datetime] = mapped_column(DateTime)

    # Longitude
    longitude: Mapped[float] = mapped_column(Float)

    # Latitude
    latitude: Mapped[float] = mapped_column(Float)

    # Accident Type
    accident_type: Mapped[str] = mapped_column(String(50), nullable=False)

    # Number of Involved Vehicles
    involved_vehicles_num: Mapped[str] = mapped_column(String(50), nullable=False)

    # Description
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
