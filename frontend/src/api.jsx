const BASE_URL = 'https://internai-m7gi.onrender.com'

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