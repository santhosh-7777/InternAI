import requests
from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv('ANAKIN_API_KEY')
print('Key loaded:', repr(key[:15]) if key else 'NONE')

r = requests.post(
    'https://anakin.io/v1/holocron/task',
    headers={'X-API-Key': key, 'Content-Type': 'application/json'},
    json={'action_id': 'ro_jobs', 'params': {'tag': 'python', 'limit': 5}}
)
print('Status:', r.status_code)
print('Response:', r.text[:300])