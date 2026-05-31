import os
import json
from google import genai
from dotenv import load_dotenv
from models import AIInsight

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_jobs(jobs: list, salary: dict, query: str) -> AIInsight:
    """
    Send merged job data to Gemini and get structured AI insights back.
    Returns an AIInsight object.
    """

    job_summaries = []
    for job in jobs[:20]:
        job_summaries.append({
            "title": job.get("title"),
            "company": job.get("company"),
            "tags": job.get("tags", [])[:5],
            "description": job.get("description", "")[:150]
        })

    salary_str = ""
    if salary:
        salary_str = f"""
Salary data for '{query}' in {salary.get('location', 'India')}:
- Monthly median: ₹{salary.get('monthly_median', 'N/A')}
- Monthly range: ₹{salary.get('monthly_min', 'N/A')} - ₹{salary.get('monthly_max', 'N/A')}
- Yearly median: ₹{salary.get('yearly_median', 'N/A')}
"""

    prompt = f"""
You are a career intelligence assistant helping CS students find internships.

The student searched for: "{query}"

Here are {len(job_summaries)} job listings fetched in real-time:
{json.dumps(job_summaries, indent=2)}

{salary_str}

Based on this data, respond ONLY with a valid JSON object in this exact format:
{{
  "summary": "2-3 sentence overview of the current job market for this search",
  "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "career_tip": "One specific actionable tip for a student applying to these roles",
  "market_trend": "One sentence about demand or trend for this role right now",
  "top_companies": ["company1", "company2", "company3"]
}}

Rules:
- top_skills must be exactly 5 real technical skills from the job data
- top_companies must be exactly 3 companies from the job listings
- career_tip must be specific and actionable, not generic
- Respond with ONLY the JSON, no extra text, no markdown, no backticks
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        raw = response.text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        parsed = json.loads(raw)

        return AIInsight(
            summary=parsed.get("summary", ""),
            top_skills=parsed.get("top_skills", []),
            career_tip=parsed.get("career_tip", ""),
            market_trend=parsed.get("market_trend", ""),
            top_companies=parsed.get("top_companies", [])
        )

    except Exception as e:
        print(f"[Gemini Error] {e}")
        return AIInsight(
            summary=f"Found {len(jobs)} {query} opportunities across multiple platforms.",
            top_skills=["Python", "Git", "Communication", "Problem Solving", "APIs"],
            career_tip="Tailor your resume to match the top skills listed in each job description.",
            market_trend="Remote internship demand remains high for technical roles.",
            top_companies=[]
        )