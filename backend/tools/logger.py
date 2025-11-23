"""Structured logging utility"""
import logging
import sys
from typing import Optional

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)


def get_logger(name: str, level: Optional[int] = None) -> logging.Logger:
    """
    Get configured logger instance
    
    Args:
        name: Logger name (typically __name__)
        level: Optional logging level override
        
    Returns:
        Configured logger
    """
    logger = logging.getLogger(name)
    if level:
        logger.setLevel(level)
    return logger
