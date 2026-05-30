import { useState } from 'react'
import './App.css'
import { searchJobs } from './api'
import SearchBar from './components/SearchBar'
import JobCard from './components/JobCard'
import SalaryCard from './components/SalaryCard'
import AIInsight from './components/AIInsight'

function Skeleton() {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
      <div className="flex gap-3 mb-4">
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 13, width: '45%' }} />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {[60,80,55].map(w => <div key={w} className="skeleton" style={{ height: 22, width: w, borderRadius: 6 }} />)}
      </div>
      <div className="skeleton" style={{ height: 13, width: '100%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 13, width: '80%', marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: 13, width: 100 }} />
        <div className="skeleton" style={{ height: 32, width: 80, borderRadius: 8 }} />
      </div>
    </div>
  )
}

function StatsBar({ results, query }) {
  const stats = [
    { value: results.total, label: 'Results Found', icon: '🎯', color: 'var(--accent)' },
    { value: results.sources?.remoteok || 0, label: 'RemoteOK', icon: '🌐', color: 'var(--green)' },
    { value: results.sources?.weworkremotely || 0, label: 'WeWorkRemotely', icon: '💼', color: 'var(--blue)' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '16px 20px',
          boxShadow: 'var(--card-shadow)',
        }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 28, color: s.color, lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastQuery, setLastQuery] = useState('')

  async function handleSearch(query, location) {
    setLoading(true)
    setError(null)
    setLastQuery(query)
    setResults(null)
    try {
      const data = await searchJobs(query, location)
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const showHero = !results && !loading

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} className="dot-grid">

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 60 }}
          className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div style={{
              background: 'var(--accent)',
              borderRadius: 10, width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--ink)' }}>
              InternAI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" style={{
              background: 'var(--green-light)', borderRadius: 99,
              padding: '5px 12px',
            }}>
              <div className="live-dot" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)' }}>Live Data</span>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              border: '1px solid #ddd6fe',
              padding: '5px 12px', borderRadius: 99,
            }}>
              ⚡ Anakin Wire
            </span>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px' }}>

        {/* Hero */}
        {showHero && (
          <div style={{ textAlign: 'center', padding: '72px 0 48px', position: 'relative' }} className="fade-up">
            <div className="hero-orb-1" /><div className="hero-orb-2" />
            <div style={{ position: 'relative' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--accent-light)', border: '1px solid #ddd6fe',
                borderRadius: 99, padding: '6px 16px', marginBottom: 28,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em' }}>
                  AI-POWERED INTERNSHIP INTELLIGENCE
                </span>
              </div>

              <h1 style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                lineHeight: 1.05,
                color: 'var(--ink)',
                marginBottom: 20,
                letterSpacing: '-0.03em',
              }}>
                Find smarter.<br />
                <span className="gradient-text">Apply faster.</span>
              </h1>

              <p style={{
                fontSize: 18, color: 'var(--ink-3)', lineHeight: 1.7,
                maxWidth: 520, margin: '0 auto 48px',
              }}>
                Search internships across RemoteOK, WeWorkRemotely & Indeed — powered by Anakin Wire with AI salary insights.
              </p>
            </div>
          </div>
        )}

        {/* Results heading */}
        {results && !loading && (
          <div style={{ padding: '32px 0 24px' }} className="flex items-center justify-between fade-up">
            <div>
              <h2 style={{
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 800, fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.02em'
              }}>
                {results.total} results for{' '}
                <span style={{ color: 'var(--accent)' }}>"{lastQuery}"</span>
              </h2>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>
                Real-time data via Anakin Wire · {Object.values(results.sources).filter(Boolean).length} sources
              </p>
            </div>
            <button onClick={() => { setResults(null); setError(null) }}
              style={{
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '8px 16px', fontSize: 13, fontWeight: 600,
                color: 'var(--ink-3)', background: '#fff', cursor: 'pointer',
                transition: 'all 0.15s', fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
              onMouseOver={e => e.target.style.borderColor = 'var(--accent)'}
              onMouseOut={e => e.target.style.borderColor = 'var(--border)'}>
              ← New Search
            </button>
          </div>
        )}

        {/* Search */}
        <div style={{
          maxWidth: showHero ? 640 : 720,
          margin: showHero ? '0 auto 48px' : '0 auto 32px',
          transition: 'all 0.3s ease',
        }} className="fade-up-1">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff5f5', border: '1px solid #ffc9c9',
            borderRadius: 12, padding: '14px 18px',
            maxWidth: 640, margin: '0 auto 24px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#c92a2a' }}>
              ⚠ {error} — Is your backend running on port 8000?
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8, marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 28, width: '50%', marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 11, width: '70%' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1,2,3,4].map(i => <Skeleton key={i} />)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1,2].map(i => (
                  <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
                    <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 16 }} />
                    <div className="skeleton" style={{ height: 32, width: '75%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: '60%' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div>
            <StatsBar results={results} query={lastQuery} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
              {/* Jobs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {results.jobs.map((job, i) => (
                  <JobCard key={`${job.source}-${i}`} job={job} index={i} />
                ))}
              </div>
              {/* Sidebar */}
              <div style={{ position: 'sticky', top: 76, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <SalaryCard salary={results.salary} />
                <AIInsight insight={results.insight} sources={results.sources} />
              </div>
            </div>
          </div>
        )}

        {/* Landing source cards */}
        {showHero && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }} className="fade-up-3">
            {[
              { emoji: '🌐', label: 'RemoteOK', desc: '15+ remote jobs', color: '#d3f9d8', border: '#b2f2bb' },
              { emoji: '💼', label: 'WeWorkRemotely', desc: '15+ remote jobs', color: '#dbe4ff', border: '#bac8ff' },
              { emoji: '🔍', label: 'Indeed India', desc: 'Connect account', color: '#ffe8cc', border: '#ffc078' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#fff', border: `1px solid ${s.border}`,
                borderRadius: 16, padding: '20px 28px',
                minWidth: 170, textAlign: 'center',
                boxShadow: 'var(--card-shadow)',
                transition: 'transform 0.15s',
              }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{
                  background: s.color, borderRadius: 14,
                  width: 52, height: 52, fontSize: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  {s.emoji}
                </div>
                <p style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginBottom: 3 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '24px 0' }}>
        <p style={{ fontSize: 12, color: 'var(--ink-4)' }}>
          InternAI · Built with Anakin Wire · Real-time internship intelligence
        </p>
      </footer>
    </div>
  )
}