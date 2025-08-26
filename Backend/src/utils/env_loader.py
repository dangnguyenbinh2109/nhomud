# src/utils/env_loader.py
import os
from pathlib import Path
from dotenv import load_dotenv

def load_env():
    current_dir = Path(__file__).resolve().parent
    for parent in [current_dir] + list(current_dir.parents):
        env_file = parent / ".env"
        if env_file.exists():
            load_dotenv(dotenv_path=env_file)
            return
