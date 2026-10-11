"""Structured logging configuration for GeoMeasure AI."""

import logging
import sys


def setup_logging() -> None:
    """Configures application-wide logging format and log levels."""
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)],
    )


logger = logging.getLogger("geomeasure_ai")
