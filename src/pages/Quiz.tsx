import { useMemo, useState } from 'react'
import { getTopic } from '../data/topics'
import { ListenButton } from '../components/ListenButton'
import { ProgressBar } from '../components/ProgressBar'
import { shuffle } from '../lib/score'
import type { Progress } from '../lib/progress'
import { addXp, markModeDone } from '../lib/progress'

type Props = {
  topicId: string
  progress: Progress
  onProgress: (p: Progress) => void
  onBack: () => void
  onSpeak: () => void
}

type Question =
  | { kind: 'choice'; phraseId: string; prompt: string; answer: string; options: string[] }
  | { kind: 'blank'; phraseId: string; prompt: string; answer: string; en: string }

export function Quiz({ topicId, progress, onProgress, onBack, onSpeak }: Props) {
  const topic = getTopic(topicId)
  const questions = useMemo(() => {
    if (!topic) return [] as Question[]
    const list: Question[] = []
    for (const p of topic.phrases) {
      list.push({
        kind: 'choice',
        phraseId: p.id,
        prompt: p.en,
        answer: p.pt,
        options: shuffle([p.pt, ...p.distractors]).slice(0, 4),
      })
      if (p.blank) {
        list.push({
          kind: 'blank',
          phraseId: p.id,
          prompt: p.blank.prompt,
          answer: p.blank.answer,
          en: p.en,
        })
      }
    }
    return shuffle(list).slice(0, 10)
  }, [topic])

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'ok' | 'bad' | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [fill, setFill] = useState('')
  const [done, setDone] = useState(false)

  if (!topic) return null
  const q = questions[index]

  function finish(finalScore: number) {
    let next = addXp(progress, finalScore * 4)
    next = markModeDone(next, topicId, 'quiz')
    onProgress(next)
    setDone(true)
  }

  function advance(correct: boolean) {
    const nextScore = score + (correct ? 1 : 0)
    setScore(nextScore)
    setTimeout(() => {
      setFeedback(null)
      setPicked(null)
      setFill('')
      if (index >= questions.length - 1) {
        finish(nextScore)
      } else {
        setIndex((i) => i + 1)
      }
    }, 700)
  }

  function choose(option: string) {
    if (feedback || !q || q.kind !== 'choice') return
    const correct = option === q.answer
    setPicked(option)
    setFeedback(correct ? 'ok' : 'bad')
    advance(correct)
  }

  function submitFill(e: React.FormEvent) {
    e.preventDefault()
    if (feedback || !q || q.kind !== 'blank') return
    const correct = fill.trim().toLowerCase() === q.answer.toLowerCase()
    setFeedback(correct ? 'ok' : 'bad')
    advance(correct)
  }

  if (done) {
    return (
      <main className="page">
        <div className="section-head">
          <h2>Quiz fechado</h2>
          <p>
            Você acertou {score} de {questions.length}. Agora bora treinar a boca.
          </p>
        </div>
        <div className="panel panel-wide">
          <div className="score-ring">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <div className="actions" style={{ marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-primary" onClick={onSpeak}>
              Praticar falando
            </button>
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Voltar aos modos
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!q) return null

  return (
    <main className="page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Modos
      </button>
      <div className="section-head">
        <h2>Quiz · {topic.title}</h2>
        <p>
          Pergunta {index + 1}/{questions.length}
        </p>
      </div>
      <ProgressBar value={index + 1} max={questions.length} />
      <div className="panel panel-wide">
        {q.kind === 'choice' ? (
          <>
            <p className="phrase">{q.prompt}</p>
            <ListenButton text={q.prompt} label="Ouvir a frase" />
            <div className="choice-list">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`choice${picked === opt ? (feedback === 'ok' ? ' correct' : ' wrong') : ''}${feedback && opt === q.answer ? ' correct' : ''}`}
                  onClick={() => choose(opt)}
                  disabled={!!feedback}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="phrase">{q.prompt}</p>
            <p className="translation">Complete com a palavra certa em inglês.</p>
            <ListenButton text={q.en} label="Ouvir completa" />
            <form onSubmit={submitFill}>
              <input
                className="fill-input"
                value={fill}
                onChange={(e) => setFill(e.target.value)}
                placeholder="Digite a palavra…"
                autoFocus
                disabled={!!feedback}
              />
              <div className="actions" style={{ marginTop: '0.85rem' }}>
                <button type="submit" className="btn btn-primary" disabled={!!feedback || !fill.trim()}>
                  Conferir
                </button>
              </div>
            </form>
            {feedback === 'bad' && (
              <p className="feedback bad">Resposta: {q.answer}</p>
            )}
          </>
        )}
        {feedback === 'ok' && <p className="feedback ok">Isso aí!</p>}
      </div>
    </main>
  )
}
