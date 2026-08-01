import { levelLabel, topics } from '../data/topics'
import { topicArt } from '../data/art'
import type { Progress } from '../lib/progress'
import { FaunaField } from '../components/FaunaField'

type Props = {
  progress: Progress
  onOpen: (topicId: string) => void
}

export function Topics({ progress, onOpen }: Props) {
  return (
    <main className="page page-with-fauna">
      <FaunaField dense />
      <div className="section-head">
        <h2>Escolhe teu tema</h2>
        <p>Do Arpoador ao dating app — cada tema tem frases, escuta, quiz e prática falando.</p>
      </div>
      <div className="topic-grid">
        {topics.map((topic) => {
          const done = progress.completedTopics.includes(topic.id)
          const modes = progress.completedModes[topic.id]?.length || 0
          const cover = topicArt[topic.id]
          return (
            <button
              key={topic.id}
              type="button"
              className="topic-tile topic-tile-art"
              onClick={() => onOpen(topic.id)}
            >
              <div className="topic-cover">
                {cover && <img src={cover} alt="" loading="lazy" />}
              </div>
              <div className="topic-copy">
                <div>
                  <div className="emoji" aria-hidden>
                    {topic.emoji}
                  </div>
                  <h3>{topic.title}</h3>
                  <p>{topic.blurb}</p>
                </div>
                <div className="topic-meta">
                  <span>
                    {topic.phrases.length} frases · {levelLabel(topic.level)}
                  </span>
                  <span>{done ? 'completa' : `${modes}/3 modos`}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </main>
  )
}
