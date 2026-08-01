import { levelLabel, topics } from '../data/topics'
import type { Progress } from '../lib/progress'

type Props = {
  progress: Progress
  onOpen: (topicId: string) => void
}

export function Topics({ progress, onOpen }: Props) {
  return (
    <main className="page">
      <div className="section-head">
        <h2>Escolhe teu tema</h2>
        <p>Do Arpoador ao dating app — cada tema tem frases, escuta, quiz e prática falando.</p>
      </div>
      <div className="topic-grid">
        {topics.map((topic) => {
          const done = progress.completedTopics.includes(topic.id)
          const modes = progress.completedModes[topic.id]?.length || 0
          return (
            <button
              key={topic.id}
              type="button"
              className="topic-tile"
              onClick={() => onOpen(topic.id)}
            >
              <div>
                <div className="emoji" aria-hidden>
                  {topic.emoji}
                </div>
                <h3>{topic.title}</h3>
                <p>{topic.blurb}</p>
              </div>
              <div className="topic-meta">
                <span>{topic.phrases.length} frases · {levelLabel(topic.level)}</span>
                <span>{done ? 'completa' : `${modes}/3 modos`}</span>
              </div>
            </button>
          )
        })}
      </div>
    </main>
  )
}
