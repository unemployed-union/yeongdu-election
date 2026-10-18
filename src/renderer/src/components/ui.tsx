import { Link } from 'react-router-dom'

type IconName =
  | 'ballot'
  | 'arrow'
  | 'external'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'title'
  | 'award'
  | 'check'
  | 'users'
  | 'chart'
  | 'reset'

const paths: Record<IconName, React.ReactNode> = {
  ballot: (
    <>
      <path d="m9 3 9 4-4 9-9-4 4-9Z" />
      <path d="m9 9 2 2 4-3M5 13l-2 4v4h18v-4l-3-5M3 17h18" />
    </>
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  external: <path d="M7 17 17 7M7 7h10v10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
    </>
  ),
  title: <path d="M4 6V4h16v2M12 4v16M8 20h8" />,
  award: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="m8 12-2 9 6-3 6 3-2-9" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h17M9 15v-4M14 15V6M19 15V9" />
    </>
  ),
  reset: <path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" />
}

export function Icon({
  name,
  className = ''
}: {
  name: IconName
  className?: string
}): React.JSX.Element {
  return (
    <svg
      className={`icon ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export function Brand(): React.JSX.Element {
  return (
    <Link className="brand" to="/" aria-label="Yeongdu Election 홈">
      <span className="brand-mark">
        <Icon name="ballot" />
      </span>
      <span>
        yeongdu<span className="brand-word">election</span>
      </span>
    </Link>
  )
}

export function EmptyState({
  icon,
  title,
  children,
  compact = false
}: {
  icon: IconName
  title: string
  children: React.ReactNode
  compact?: boolean
}): React.JSX.Element {
  return (
    <div className={`empty-state ${compact ? 'empty-compact' : ''}`}>
      <span className="empty-icon">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}
