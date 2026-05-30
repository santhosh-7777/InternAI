import { useState } from 'react'
import SourceBadge from './SourceBadge'

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim() || ''
}

function timeAgo(dateStr) {
  if (!dateStr) return null
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  if (diff < 30) return `${diff}d ago`
  return `${Math.floor(diff / 30)}mo ago`
}

const AVATAR_COLORS = [
  { bg: '#ede9fe', text: '#5b21b6' },
  { bg: '#d3f9d8', text: '#087f5b' },
  { bg: '#dbe4ff', text: '#1864ab' },
  { bg: '#fff3bf', text: '#e67700' },
  { bg: '#ffd6e0', text: '#c2255c' },
  { bg: '#d0ebff', text: '#1c7ed6' },
]

function CompanyAvatar({ name, index }) {
  const initials = name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div style={{
      background: c.bg,
      color: c.text,
      width: 44,
      height: 44,
      borderRadius: 12,
      flexShrink: 0,
      fontFamily: 'Bricolage Grotesque, sans-serif',
      fontWeight: 700,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {initials}
    </div>
  )
}

export default function JobCard({ job, index }) {
  const [hovered, setHovered] = useState(false)

  const salary = job.salary_min && job.salary_max && job.salary_min > 0
    ? `$${job.salary_min}–${job.salary_max}k`
    : null
  const description = stripHtml(job.description)
  const ago = timeAgo(job.posted)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#c5bef8' : '#e9ecef'}`,
        borderRadius: 16,
        boxShadow: hovered
          ? '0 8px 24px rgba(80,70,229,0.08), 0 2px 8px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: 24,
        animationDelay: `${index * 0.04}s`,
        opacity: 0,
        animation: `fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) ${index * 0.04}s forwards`,
        cursor: 'default',
      }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <CompanyAvatar name={job.company} index={index} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
            <h3 style={{
              color: hovered ? '#5046e5' : '#0f0f10',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.3,
              transition: 'color 0.15s ease',
              margin: 0,
            }}>
              {job.title}
            </h3>
            <SourceBadge source={job.source} />
          </div>
          <p style={{ color: '#6c757d', fontSize: 13, fontWeight: 500, margin: 0 }}>
            {job.company}
          </p>
        </div>
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {job.tags.slice(0, 6).map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              background: '#f1f3f5',
              color: '#343a40',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {description && (
        <p style={{
          color: '#6c757d',
          fontSize: 13,
          lineHeight: 1.6,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </p>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #e9ecef',
        paddingTop: 14,
        marginTop: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {salary && (
            <span style={{ color: '#0ca678', fontWeight: 700, fontSize: 13 }}>
              💰 {salary}
            </span>
          )}
          <span style={{ color: '#adb5bd', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {job.location}
          </span>
          {ago && <span style={{ color: '#adb5bd', fontSize: 12 }}>{ago}</span>}
        </div>

        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: hovered ? '#5046e5' : '#f1f3f5',
              color: hovered ? '#fff' : '#343a40',
              borderRadius: 8,
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}>
            Apply →
          </a>
        )}
      </div>
    </div>
  )
}