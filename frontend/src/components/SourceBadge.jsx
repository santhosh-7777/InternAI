export default function SourceBadge({ source }) {
  const config = {
    RemoteOK:       { bg: '#d3f9d8', color: '#0ca678' },
    WeWorkRemotely: { bg: '#dbe4ff', color: '#1971c2' },
    Indeed:         { bg: '#ffe8cc', color: '#e8590c' },
  }
  const c = config[source] || { bg: '#f1f3f5', color: '#6c757d' }
  return (
    <span style={{ background: c.bg, color: c.color }}
      className="badge flex-shrink-0">
      {source === 'RemoteOK' && '🟢 '}
      {source === 'WeWorkRemotely' && '🔵 '}
      {source === 'Indeed' && '🟠 '}
      {source}
    </span>
  )
}