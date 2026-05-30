import { useState, useRef } from 'react'

const SUGGESTIONS = [
  { label: 'Python', icon: '🐍' },
  { label: 'React', icon: '⚛️' },
  { label: 'Machine Learning', icon: '🤖' },
  { label: 'Data Science', icon: '📊' },
  { label: 'Backend', icon: '⚙️' },
  { label: 'DevOps', icon: '🚀' },
  { label: 'Java', icon: '☕' },
  { label: 'Flutter', icon: '📱' },
]

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Bangalore')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim(), location)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#fff',
          border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border-strong)'}`,
          borderRadius: 14,
          boxShadow: focused
            ? '0 0 0 4px rgba(80,70,229,0.08), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.15s ease',
        }} className="flex items-center gap-2 pl-5 pr-2 py-3">

          {loading ? (
            <svg className="animate-spin" width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="var(--ink-3)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          )}

          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search by skill, role, or technology..."
            className="flex-1 outline-none bg-transparent text-base"
            style={{ color: 'var(--ink)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 27 }}
          />

          <div style={{ width: 1, height: 22, background: 'var(--border)' }} className="mx-1" />

          <div className="flex items-center gap-1.5 px-2">
            <svg width="13" height="13" fill="none" stroke="var(--ink-4)" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="outline-none bg-transparent text-sm w-24"
              style={{ color: 'var(--ink-3)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            />
          </div>

          <button type="submit" disabled={loading || !query.trim()}
            style={{
              background: loading || !query.trim() ? 'var(--bg-muted)' : 'var(--accent)',
              color: loading || !query.trim() ? 'var(--ink-4)' : '#fff',
              borderRadius: 10,
              transition: 'all 0.15s ease',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
            className="px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed whitespace-nowrap">
            {loading ? 'Searching...' : 'Search →'}
          </button>
        </div>
      </form>

      {/* Quick search pills */}
      <div className="flex flex-wrap gap-2.5 mt-4">
        {SUGGESTIONS.map(s => (
          <button key={s.label}
            onClick={() => { setQuery(s.label); onSearch(s.label, location) }}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 99,
              color: 'var(--ink-3)',
              background: 'var(--bg)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transition: 'all 0.15s ease',
            }}
            className="px-4 py-2 text-sm font-medium hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 flex items-center gap-1">
            <span>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}