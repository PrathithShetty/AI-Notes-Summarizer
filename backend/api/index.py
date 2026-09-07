import os
import sys

# Make sure the backend/ root (parent of this api/ folder) is importable,
# so `from app import create_app` and `from config import Config` resolve
# the same way they do when running `python run.py` locally.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app

app = create_app()
