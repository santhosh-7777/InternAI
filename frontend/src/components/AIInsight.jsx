export default function AIInsight({ insight, sources }) {
  if (!insight) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
      border: '1px solid #e9d5ff',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--card-shadow)',
    }} className="p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div style={{ background: 'var(--accent-light)', borderRadius: 8, padding: 7 }}>
            <svg width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 5v5l3 3"/>
              <circle cx="12" cy="12" r="1" fill="var(--accent)"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            AI Copilot
          </span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600,
          background: 'var(--accent-light)',
          color: 'var(--accent)',
          padding: '3px 8px', borderRadius: 99
        }}>Gemini</span>
      </div>

      {/* Summary */}
      <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 16 }}>
        {insight.summary}
      </p>

      {/* Top Skills */}
      {insight.top_skills?.length > 0 && (
        <div className="mb-4">
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-4)', letterSpacing: '0.08em', marginBottom: 8 }}>
            TOP SKILLS IN DEMAND
          </p>
          <div className="flex flex-wrap gap-1.5">
            {insight.top_skills.map((skill, i) => (
              <span key={skill} style={{
                background: i === 0 ? 'var(--accent)' : i === 1 ? '#7c3aed' : 'var(--bg-muted)',
                color: i < 2 ? '#fff' : 'var(--ink-2)',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
              }}>
                {i === 0 && '🔥 '}{skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Career Tip */}
      {insight.career_tip && (
        <div style={{
          background: '#fff',
          border: '1px solid #e9d5ff',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 14,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: 5 }}>
            💡 CAREER TIP
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>{insight.career_tip}</p>
        </div>
      )}

      {/* Market Trend */}
      {insight.market_trend && (
        <div style={{ borderTop: '1px solid #e9d5ff', paddingTop: 12, marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-4)', letterSpacing: '0.08em', marginBottom: 5 }}>
            📈 MARKET TREND
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>{insight.market_trend}</p>
        </div>
      )}

      {/* Sources */}
      {sources && (
        <div style={{ borderTop: '1px solid #e9d5ff', paddingTop: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-4)', letterSpacing: '0.08em', marginBottom: 8 }}>
            DATA SOURCES
          </p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(sources).map(([src, count]) => count > 0 && (
              <span key={src} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 11,
                color: 'var(--ink-3)',
                fontWeight: 500,
              }}>
                {src} <strong style={{ color: 'var(--ink)' }}>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}