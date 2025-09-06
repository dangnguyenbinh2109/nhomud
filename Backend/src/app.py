from dotenv import load_dotenv
from utils.env_loader import load_env
from create_app import create_app

load_env()
load_dotenv()

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6868, debug=True)