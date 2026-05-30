from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import SearchRequest, SearchResponse, Job, SalaryData
from wire import fetch_all_jobs
from ai import analyze_jobs

app = FastAPI(title="InternAI API", version="1.0.0")

# Allow React frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "InternAI backend is running"}


@app.post("/search", response_model=SearchResponse)
def search_internships(request: SearchRequest):
    """
    Main endpoint — fetches jobs from all 3 Wire sources,
    gets salary data, runs Gemini analysis, returns everything.
    """
    query = request.query.strip()
    location = request.location.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Step 1: Fetch from all 3 Wire sources
    wire_data = fetch_all_jobs(query=query, location=location)

    jobs_raw = wire_data.get("jobs", [])
    salary_raw = wire_data.get("salary", {})
    sources = wire_data.get("sources", {})

    if not jobs_raw:
        raise HTTPException(
            status_code=404,
            detail="No jobs found. Try a different search term."
        )

    # Step 2: Convert to Job models
    jobs = []
    for j in jobs_raw:
        try:
            jobs.append(Job(
                source=j.get("source", "Unknown"),
                title=j.get("title", "N/A"),
                company=j.get("company", "N/A"),
                location=j.get("location", "Remote"),
                salary_min=j.get("salary_min"),
                salary_max=j.get("salary_max"),
                tags=j.get("tags", []),
                apply_url=j.get("apply_url", ""),
                posted=j.get("posted", ""),
                description=j.get("description", "")
            ))
        except Exception as e:
            print(f"[Job parse error] {e}")
            continue

    # Step 3: Convert salary data
    salary = None
    if salary_raw:
        try:
            salary = SalaryData(**salary_raw)
        except Exception as e:
            print(f"[Salary parse error] {e}")

    # Step 4: Run Gemini analysis
    insight = analyze_jobs(
        jobs=[j.dict() for j in jobs],
        salary=salary_raw,
        query=query
    )

    return SearchResponse(
        jobs=jobs,
        salary=salary,
        insight=insight,
        sources=sources,
        total=len(jobs)
    )


@app.get("/health")
def health():
    return {"status": "ok", "sources": ["RemoteOK", "WeWorkRemotely", "Indeed"]}