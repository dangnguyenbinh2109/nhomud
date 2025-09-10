# src/app.py
import warnings
from sqlalchemy import exc as sa_exc
warnings.filterwarnings("ignore", category=sa_exc.SAWarning, message="Unrecognized server version info.*")
from src.create_app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="localhost", port=6868, debug=True)
