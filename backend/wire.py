import requests
import time
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ANAKIN_API_KEY")
print(f"[Debug] API Key loaded: {repr(API_KEY[:15]) if API_KEY else 'NONE'}")
BASE_URL = "https://anakin.io/v1"
CREDENTIAL_ID = os.getenv("INDEED_CREDENTIAL_ID")

HEADERS = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}


# ─────────────────────────────────────────
# CORE: Submit task + Poll until done
# ─────────────────────────────────────────

def submit_task(action_id: str, params: dict, credential_id: str = None) -> dict:
    payload = {
        "action_id": action_id,
        "params": params
    }
    if credential_id:
        payload["credential_id"] = credential_id

    response = requests.post(
        f"{BASE_URL}/holocron/task",
        headers=HEADERS,
        json=payload,
        timeout=30
    )
    response.raise_for_status()
    return response.json()


def poll_result(job_id: str, max_wait: int = 60) -> dict:
    url = f"{BASE_URL}/holocron/jobs/{job_id}"
    waited = 0

    while waited < max_wait:
        res = requests.get(url, headers=HEADERS, timeout=15)
        res.raise_for_status()
        data = res.json()

        if data.get("status") == "completed":
            return data.get("data", {})

        if data.get("status") == "failed":
            raise Exception(f"Wire job failed: {data}")

        time.sleep(3)
        waited += 3

    raise TimeoutError(f"Wire job {job_id} timed out after {max_wait}s")


def run_action(action_id: str, params: dict, credential_id: str = None) -> dict:
    job = submit_task(action_id, params, credential_id)
    job_id = job.get("job_id")
    if not job_id:
        raise Exception(f"No job_id returned: {job}")
    return poll_result(job_id)


# ─────────────────────────────────────────
# SOURCE 1: RemoteOK
# ─────────────────────────────────────────

def fetch_remoteok(tag: str, limit: int = 20) -> list:
    try:
        data = run_action("ro_jobs", {"tag": tag, "limit": limit})
        # Wire returns: data -> data -> data -> [list of jobs]
        jobs = data.get("data", {}).get("data", [])
        print(f"[RemoteOK] Raw jobs count: {len(jobs)}")

        normalized = []
        for job in jobs:
            normalized.append({
                "source": "RemoteOK",
                "title": job.get("position", "N/A"),
                "company": job.get("company", "N/A"),
                "location": "Remote",
                "salary_min": job.get("salary_min"),
                "salary_max": job.get("salary_max"),
                "tags": job.get("tags", []),
                "apply_url": job.get("url", ""),
                "posted": job.get("date", ""),
                "description": job.get("description", "")[:300]
            })

        return normalized

    except Exception as e:
        print(f"[RemoteOK Error] {e}")
        return []


# ─────────────────────────────────────────
# SOURCE 2: WeWorkRemotely
# ─────────────────────────────────────────

def fetch_weworkremotely(category: str = "programming", limit: int = 20) -> list:
    try:
        data = run_action("ww_category", {"category": category, "limit": limit})
        # Wire returns: data -> data -> data -> [list of jobs]
        jobs = data.get("data", {}).get("data", [])
        print(f"[WWR] Raw jobs count: {len(jobs)}")

        normalized = []
        for job in jobs:
            normalized.append({
                "source": "WeWorkRemotely",
                "title": job.get("title", "N/A"),
                "company": job.get("company", "N/A"),
                "location": "Remote",
                "salary_min": None,
                "salary_max": None,
                "tags": job.get("tags", []),
                "apply_url": job.get("url", ""),
                "posted": job.get("date", ""),
                "description": job.get("description", "")[:300]
            })

        return normalized

    except Exception as e:
        print(f"[WeWorkRemotely Error] {e}")
        return []


# ─────────────────────────────────────────
# SOURCE 3: Indeed
# ─────────────────────────────────────────

def fetch_indeed_jobs(query: str, location: str = "Remote", limit: int = 20) -> list:
    if not CREDENTIAL_ID:
        print("[Indeed] No credential_id set — skipping job search")
        return []

    try:
        data = run_action(
            "in_search_jobs",
            {
                "query": query,
                "location": location,
                "start": 0,
                "sort": "relevance",
                "country_domain": "in"
            },
            credential_id=CREDENTIAL_ID
        )

        jobs = data.get("data", {}).get("jobs", [])
        print(f"[Indeed] Raw jobs count: {len(jobs)}")

        normalized = []
        for job in jobs[:limit]:
            normalized.append({
                "source": "Indeed",
                "title": job.get("title", "N/A"),
                "company": job.get("company", "N/A"),
                "location": job.get("location", location),
                "salary_min": None,
                "salary_max": None,
                "tags": [],
                "apply_url": job.get("job_url", ""),
                "posted": job.get("date", ""),
                "description": job.get("snippet", "")[:300],
                "job_key": job.get("job_key", "")
            })

        return normalized

    except Exception as e:
        print(f"[Indeed Jobs Error] {e}")
        return []


def fetch_indeed_salary(title: str, location: str = "Bangalore") -> dict:
    try:
        data = run_action(
            "in_salary_search",
            {
                "title": title,
                "location": location,
                "country": "IN",
                "locale": "en-IN"
            }
        )

        salary_data = data.get("data", {})
        salaries = salary_data.get("salaries", [])

        result = {"currency": "INR", "location": location, "title": title}

        for s in salaries:
            stype = s.get("type", "").upper()
            if stype == "MONTHLY":
                result["monthly_median"] = round(s.get("median", 0))
                result["monthly_min"] = round(s.get("min", 0))
                result["monthly_max"] = round(s.get("max", 0))
            elif stype == "YEARLY":
                result["yearly_median"] = round(s.get("median", 0))
                result["yearly_min"] = round(s.get("min", 0))
                result["yearly_max"] = round(s.get("max", 0))

        return result

    except Exception as e:
        print(f"[Indeed Salary Error] {e}")
        return {}


# ─────────────────────────────────────────
# MAIN: Fetch all 3 sources together
# ─────────────────────────────────────────

def fetch_all_jobs(query: str, location: str = "Bangalore") -> dict:
    print(f"\n[Wire] Fetching jobs for: '{query}' in {location}")

    remoteok_jobs = fetch_remoteok(tag=query, limit=15)
    wwr_jobs      = fetch_weworkremotely(category="programming", limit=15)
    indeed_jobs   = fetch_indeed_jobs(query=f"{query} internship", location=location, limit=15)
    salary_data   = fetch_indeed_salary(title=f"{query} intern", location=location)

    all_jobs = remoteok_jobs + wwr_jobs + indeed_jobs

    print(f"[Wire] Results → RemoteOK: {len(remoteok_jobs)} | WWR: {len(wwr_jobs)} | Indeed: {len(indeed_jobs)}")
    print(f"[Wire] Total jobs fetched: {len(all_jobs)}")

    return {
        "jobs": all_jobs,
        "salary": salary_data,
        "sources": {
            "remoteok": len(remoteok_jobs),
            "weworkremotely": len(wwr_jobs),
            "indeed": len(indeed_jobs)
        }
    }


if __name__ == "__main__":
    result = fetch_all_jobs("python", "Bangalore")
    print(f"\nTotal jobs: {len(result['jobs'])}")
    print(f"Salary data: {result['salary']}")
    print(f"Sources: {result['sources']}")
    if result['jobs']:
        print(f"\nFirst job sample:")
        print(result['jobs'][0])