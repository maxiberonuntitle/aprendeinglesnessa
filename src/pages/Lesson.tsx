import { useState } from 'react'
import { getTopic } from '../data/topics'
import { ListenButton } from '../components/ListenButton'
import { ProgressBar } from '../components/ProgressBar'
import type { Progress } from '../lib/progress'
import { addXp, markHeard, markModeDone } from '../lib/progress'

type Props = {
  topicId: string
  progress: Progress
  onProgress: (p: Progress) => void
  onBack: () => void
  onQuiz: () => void
}

export function Lesson({ topicId, progress, onProgress, onBack, onQuiz }: Props) {
  const topic = getTopic(topicId)
  const [index, setIndex] = useState(0)

  if (!topic) return null
  const phrase = topic.phrases[index]
  const atEnd = index >= topic.phrases.length - 1

  function heard() {
    let next = markHeard(progress, phrase.id)
    next = addXp(next, 2)
    onProgress(next)
  }

  function next() {
    if (atEnd) {
      onProgress(markModeDone(progress, topicId, 'lesson'))
      onQuiz()
      return
    }
    setIndex((i) => i + 1)
  }

  return (
    <main className="page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Modos
      </button>
      <div className="section-head">
        <h2>Lição · {topic.title}</h2>
        <p>
          Frase {index + 1} de {topic.phrases.length} — ouve primeiro, depois lê o tip.
        </p>
      </div>
      <ProgressBar value={index + 1} max={topic.phrases.length} />
      <div className="panel panel-wide">
        <p className="phrase">{phrase.en}</p>
        <p className="translation">{phrase.pt}</p>
        <p className="tip">💡 {phrase.tip}</p>
        <div className="actions">
          <ListenButton text={phrase.en} onSpoken={heard} />
          <button type="button" className="btn btn-primary" onClick={next}>
            {atEnd ? 'Ir pro quiz' : 'Próxima'}
          </button>
        </div>
      </div>
    </main>
  )
}
