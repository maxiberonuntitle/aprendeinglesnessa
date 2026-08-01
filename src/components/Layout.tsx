import type { ReactNode } from 'react'
import type { Progress } from '../lib/progress'
import type { Screen } from '../App'

type Props = {
  screen: Screen
  progress: Progress
  onNavigate: (screen: Screen) => void
  children: ReactNode
  showNav?: boolean
}

const links: { id: Screen; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'topics', label: 'Temas' },
  { id: 'games', label: 'Jogos' },
  { id: 'progress', label: 'Progresso' },
]

export function Layout({ screen, progress, onNavigate, children, showNav = true }: Props) {
  return (
    <div className="app-shell">
      {showNav && (
        <header className="topbar">
          <button type="button" className="brand-mark" onClick={() => onNavigate('home')}>
            Nessa <span>English</span>
          </button>
          <nav className="topnav" aria-label="Principal">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                className={screen === link.id || (link.id === 'topics' && ['lesson', 'quiz', 'speak', 'topic-modes'].includes(screen)) ? 'active' : ''}
                onClick={() => onNavigate(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="xp-chip" title="XP e streak">
            ⚡ {progress.xp} XP · 🔥 {progress.streak}d
          </div>
        </header>
      )}
      {children}
    </div>
  )
}
