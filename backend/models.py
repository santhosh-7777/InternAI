from pydantic import BaseModel
from typing import Optional, List


class Job(BaseModel):
    source: str                    # "RemoteOK", "WeWorkRemotely", "Indeed"
    title: str
    company: str
    location: str
    salary_min: Optional[float]
    salary_max: Optional[float]
    tags: List[str]
    apply_url: str
    posted: str
    description: str


class SalaryData(BaseModel):
    currency: str
    location: str
    title: str
    monthly_median: Optional[int] = None
    monthly_min: Optional[int] = None
    monthly_max: Optional[int] = None
    yearly_median: Optional[int]= None
    yearly_min: Optional[int]= None
    yearly_max: Optional[int]= None


class AIInsight(BaseModel):
    summary: str                   # 2-3 line overview
    top_skills: List[str]          # e.g. ["Python", "FastAPI", "SQL"]
    career_tip: str                # one actionable tip
    market_trend: str              # e.g. "Demand up 23% this month"
    top_companies: List[str]       # top 3 companies hiring


class SearchRequest(BaseModel):
    query: str                     # e.g. "python internship"
    location: str = "Bangalore"


class SearchResponse(BaseModel):
    jobs: List[Job]
    salary: Optional[SalaryData]
    insight: Optional[AIInsight]
    sources: dict                  # { remoteok: 12, weworkremotely: 10, indeed: 8 }
    total: int