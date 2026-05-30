export default function SalaryCard({ salary }) {
  if (!salary) return null
  const hasData = salary.monthly_median || salary.yearly_median
  const pct = salary.monthly_median && salary.monthly_max
    ? Math.round((salary.monthly_median / salary.monthly_max) * 100)
    : 55

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
      border: '1px solid #b2f2bb',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--card-shadow)',
    }} className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div style={{ background: '#d3f9d8', borderRadius: 8, padding: 7 }}>
            <svg width="15" height="15" fill="none" stroke="#0ca678" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Salary Intel
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#0ca678', fontWeight: 600, background: '#d3f9d8', padding: '3px 8px', borderRadius: 99 }}>
          Live Data
        </span>
      </div>

      {hasData ? (
        <div>
          {salary.monthly_median && (
            <div className="mb-4">
              <p style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, marginBottom: 4 }}>
                MONTHLY MEDIAN · {salary.location}
              </p>
              <p style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 32, color: 'var(--ink)', lineHeight: 1 }}>
                ₹{salary.monthly_median?.toLocaleString('en-IN')}
              </p>
              <div style={{ background: '#e6fcf5', borderRadius: 99, height: 6, marginTop: 10, overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #0ca678, #12b886)',
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: 99,
                  transition: 'width 1s ease',
                }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>₹{salary.monthly_min?.toLocaleString('en-IN')}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>₹{salary.monthly_max?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
          {salary.yearly_median && (
            <div style={{ borderTop: '1px solid #b2f2bb', paddingTop: 14 }}>
              <p style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, marginBottom: 4 }}>ANNUAL CTC</p>
              <p style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--ink)' }}>
                ₹{(salary.yearly_median / 100000).toFixed(1)}L
              </p>
              <p style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>
                ₹{(salary.yearly_min / 100000).toFixed(1)}L — ₹{(salary.yearly_max / 100000).toFixed(1)}L range
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Salary data unavailable</p>
          <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 4 }}>Try a more specific search</p>
        </div>
      )}
    </div>
  )
}