from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Declarative base. Models are added in the discovery-schema task.

    PostGIS note: when location columns are introduced, add `geoalchemy2`
    and enable the extension in a migration: CREATE EXTENSION IF NOT EXISTS postgis;
    """
