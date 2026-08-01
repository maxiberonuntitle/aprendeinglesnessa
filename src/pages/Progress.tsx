import { topics } from '../data/topics'
import type { Progress } from '../lib/progress'

type Props = {
  progress: Progress
  onTopics: () => void
}

export function ProgressPage({ progress, onTopics }: Props) {
  const heard = progress.heardPhrases.length
  const totalPhrases = topics.reduce((n, t) => n + t.phrases.length, 0)

  return (
    <main className="page">
      <div className="section-head">
        <h2>Seu progresso, Nessa</h2>
        <p>XP, streak e temas que você já mandou bem. Tudo fica salvo neste navegador.</p>
      </div>
      <div className="stats-row">
        <div className="stat">
          <strong>{progress.xp}</strong>
          <span>XP total</span>
        </div>
        <div className="stat">
          <strong>{progress.streak}</strong>
          <span>dias de streak</span>
        </div>
        <div className="stat">
          <strong>{progress.completedTopics.length}</strong>
          <span>temas completos</span>
        </div>
        <div className="stat">
          <strong>
            {heard}/{totalPhrases}
          </strong>
          <span>frases ouvidas</span>
        </div>
      </div>
      <div className="panel">
        <h3 style={{ marginTop: 0, fontFamily: 'var(--font-display)' }}>Temas</h3>
        <div className="choice-list">
          {topics.map((t) => {
            const modes = progress.completedModes[t.id]?.length || 0
            const done = progress.completedTopics.includes(t.id)
            return (
              <div key={t.id} className="choice" style={{ cursor: 'default' }}>
                <strong>
                  {t.emoji} {t.title}
                </strong>
                <div style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>
                  {done ? 'Completo' : `${modes} modos feitos`} · {t.phrases.length} frases
                </div>
              </div>
            )
          })}
        </div>
        <div className="actions" style={{ marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-coral" onClick={onTopics}>
            Continuar praticando
          </button>
        </div>
      </div>
    </main>
  )
}
