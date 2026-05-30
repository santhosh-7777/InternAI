const BASE_URL = 'http://127.0.0.1:8000'

export async function searchJobs(query, location = 'Bangalore') {
  const res = await fetch(`${BASE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, location })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Search failed')
  }
  return res.json()
}