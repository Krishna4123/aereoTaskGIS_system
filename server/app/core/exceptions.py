"""Custom application domain exceptions for GeoMeasure AI."""


class GeoMeasureException(Exception):
    """Base exception for all GeoMeasure domain errors."""

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class GeospatialParsingError(GeoMeasureException):
    """Raised when parsing Shapefile or KML geometries fails."""

    pass


class CRSDetectionError(GeoMeasureException):
    """Raised when coordinate reference system cannot be parsed or transformed."""

    pass


class InvalidGeometryError(GeoMeasureException):
    """Raised when geometry fails topological Simple Features validation."""

    pass


class DatasetNotFoundError(GeoMeasureException):
    """Raised when a requested dataset identifier does not exist."""

    pass
