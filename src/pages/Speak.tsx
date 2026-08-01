import { useMemo, useState } from 'react'
import { getTopic } from '../data/topics'
import { ListenButton } from '../components/ListenButton'
import { SpeakButton } from '../components/SpeakButton'
import { ProgressBar } from '../components/ProgressBar'
import { phraseSimilarity, scoreLabel, shuffle } from '../lib/score'
import type { Progress } from '../lib/progress'
import { addXp, markModeDone } from '../lib/progress'

type Props = {
  topicId: string
  progress: Progress
  onProgress: (p: Progress) => void
  onBack: () => void
}

export function Speak({ topicId, progress, onProgress, onBack }: Props) {
  const topic = getTopic(topicId)
  const phrases = useMemo(
    () => (topic ? shuffle(topic.phrases).slice(0, 8) : []),
    [topic],
  )
  const [index, setIndex] = useState(0)
  const [interim, setInterim] = useState('')
  const [lastHeard, setLastHeard] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [total, setTotal] = useState(0)
  const [done, setDone] = useState(false)

  if (!topic) return null
  const phrase = phrases[index]

  function onFinal(transcript: string) {
    setLastHeard(transcript)
    setInterim('')
    const s = phraseSimilarity(phrase.en, transcript)
    setScore(s)
    setTotal((t) => t + s)
    if (s >= 55) {
      onProgress(addXp(progress, Math.round(s / 10)))
    }
  }

  function next() {
    if (index >= phrases.length - 1) {
      onProgress(markModeDone(progress, topicId, 'speak'))
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setScore(null)
    setLastHeard('')
    setInterim('')
  }

  if (done) {
    const avg = Math.round(total / phrases.length)
    return (
      <main className="page">
        <div className="section-head">
          <h2>Fala aí — sessão feita</h2>
          <p>Média de pronúncia aproximada: {avg}%</p>
        </div>
        <div className="panel panel-wide">
          <div className="score-ring">{avg}</div>
          <p className="translation">{scoreLabel(avg)}</p>
          <button type="button" className="btn btn-primary" onClick={onBack}>
            Voltar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Modos
      </button>
      <div className="section-head">
        <h2>Fala aí · {topic.title}</h2>
        <p>
          Ouça, depois diga a frase. Chrome/Edge + mic liberado = melhor experiência.
        </p>
      </div>
      <ProgressBar value={index + 1} max={phrases.length} />
      <div className="panel panel-wide">
        <p className="phrase">{phrase.en}</p>
        <p className="translation">{phrase.pt}</p>
        <div className="actions">
          <ListenButton text={phrase.en} />
          <SpeakButton onFinal={onFinal} onInterim={setInterim} />
        </div>
        {(interim || lastHeard) && (
          <div className="speak-result">
            <p style={{ margin: 0, color: 'var(--mist)' }}>Você disse:</p>
            <p style={{ margin: '0.35rem 0 0', fontWeight: 600 }}>{interim || lastHeard}</p>
            {score !== null && (
              <>
                <p className="score-ring" style={{ fontSize: '2rem', margin: '0.75rem 0 0.25rem' }}>
                  {score}%
                </p>
                <p className="translation" style={{ margin: 0 }}>
                  {scoreLabel(score)}
                </p>
              </>
            )}
          </div>
        )}
        {score !== null && (
          <div className="actions" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={next}>
              {index >= phrases.length - 1 ? 'Finalizar' : 'Próxima frase'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
