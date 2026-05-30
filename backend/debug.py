import requests
import time
from dotenv import load_dotenv
import os
import json

load_dotenv()
API_KEY = os.getenv("ANAKIN_API_KEY")
BASE_URL = "https://anakin.io/v1"
HEADERS = {"X-API-Key": API_KEY, "Content-Type": "application/json"}

def test_action(action_id, params):
    print(f"\n--- Testing {action_id} ---")
    # Submit
    r = requests.post(f"{BASE_URL}/holocron/task", headers=HEADERS, json={"action_id": action_id, "params": params})
    print(f"Submit status: {r.status_code}")
    job_id = r.json().get("job_id")
    print(f"Job ID: {job_id}")

    # Poll
    for i in range(20):
        time.sleep(3)
        res = requests.get(f"{BASE_URL}/holocron/jobs/{job_id}", headers=HEADERS)
        data = res.json()
        status = data.get("status")
        print(f"Poll {i+1}: {status}")
        if status == "completed":
            print("FULL RESPONSE:")
            print(json.dumps(data, indent=2)[:1000])
            return
        if status == "failed":
            print("FAILED:", data)
            return

    print("TIMEOUT")

# Test RemoteOK
test_action("ro_jobs", {"tag": "python", "limit": 3})