import { useMemo, useState } from 'react'
import { getTopic, topics, type Topic } from '../data/topics'
import { ListenButton } from '../components/ListenButton'
import { ProgressBar } from '../components/ProgressBar'
import { NessaBuddy } from '../components/NessaBuddy'
import { shuffle } from '../lib/score'
import type { Progress } from '../lib/progress'
import { addXp, markModeDone } from '../lib/progress'

type GameMode = 'pick' | 'listen' | 'match' | 'scramble'
type Props = {
  topicId?: string
  progress: Progress
  onProgress: (p: Progress) => void
  onBack: () => void
  onPickTopic: (topicId: string) => void
}

export function Games({ topicId, progress, onProgress, onBack, onPickTopic }: Props) {
  const [mode, setMode] = useState<GameMode>('pick')
  const topic = topicId ? getTopic(topicId) : undefined

  if (!topicId || !topic) {
    return (
      <main className="page">
        <div className="section-with-buddy">
          <div className="section-head">
            <h2>Jogos</h2>
            <p>Escolhe um tema e treina com escuta, match ou scramble.</p>
          </div>
          <NessaBuddy size="md" />
        </div>
        <div className="topic-grid">
          {topics.map((t) => (
            <button key={t.id} type="button" className="topic-tile" onClick={() => onPickTopic(t.id)}>
              <div>
                <div className="emoji">{t.emoji}</div>
                <h3>{t.title}</h3>
                <p>Escuta · Match · Scramble</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    )
  }

  if (mode === 'pick') {
    return (
      <main className="page">
        <button type="button" className="back-link" onClick={onBack}>
          ← {topicId ? 'Voltar' : 'Temas'}
        </button>
        <div className="section-head">
          <h2>Jogos · {topic.title}</h2>
          <p>Rodadas curtas. Cada acerto soma XP.</p>
        </div>
        <div className="mode-picks">
          <button type="button" className="mode-pick" onClick={() => setMode('listen')}>
            <h3>👂 Escuta</h3>
            <p>Ouça a frase e escolha o significado certo.</p>
          </button>
          <button type="button" className="mode-pick" onClick={() => setMode('match')}>
            <h3>🔗 Match</h3>
            <p>Ligue inglês ↔ português.</p>
          </button>
          <button type="button" className="mode-pick" onClick={() => setMode('scramble')}>
            <h3>🧩 Scramble</h3>
            <p>Monte a frase na ordem certa.</p>
          </button>
        </div>
      </main>
    )
  }

  if (mode === 'listen') {
    return (
      <ListenGame
        topic={topic}
        progress={progress}
        onProgress={onProgress}
        onExit={() => setMode('pick')}
      />
    )
  }
  if (mode === 'match') {
    return (
      <MatchGame
        topic={topic}
        progress={progress}
        onProgress={onProgress}
        onExit={() => setMode('pick')}
      />
    )
  }
  return (
    <ScrambleGame
      topic={topic}
      progress={progress}
      onProgress={onProgress}
      onExit={() => setMode('pick')}
    />
  )
}

function ListenGame({
  topic,
  progress,
  onProgress,
  onExit,
}: {
  topic: Topic
  progress: Progress
  onProgress: (p: Progress) => void
  onExit: () => void
}) {
  const rounds = useMemo(() => shuffle(topic.phrases).slice(0, 8), [topic])
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<'ok' | 'bad' | null>(null)
  const [hits, setHits] = useState(0)
  const phrase = rounds[index]
  const options = useMemo(
    () => shuffle([phrase.pt, ...phrase.distractors]).slice(0, 4),
    [phrase],
  )

  function pick(opt: string) {
    if (feedback) return
    const ok = opt === phrase.pt
    setFeedback(ok ? 'ok' : 'bad')
    const nextHits = hits + (ok ? 1 : 0)
    setHits(nextHits)
    if (ok) onProgress(addXp(progress, 5))
    setTimeout(() => {
      if (index >= rounds.length - 1) {
        onProgress(markModeDone(progress, topic.id, 'listen-game'))
        onExit()
        return
      }
      setFeedback(null)
      setIndex((i) => i + 1)
    }, 750)
  }

  return (
    <main className="page">
      <button type="button" className="back-link" onClick={onExit}>
        ← Jogos
      </button>
      <div className="section-head">
        <h2>Escuta</h2>
        <p>
          Rodada {index + 1}/{rounds.length} · acertos {hits}
        </p>
      </div>
      <ProgressBar value={index + 1} max={rounds.length} />
      <div className="panel panel-wide">
        <p className="translation">Toca em ouvir e escolhe o significado:</p>
        <ListenButton text={phrase.en} label="Tocar áudio" />
        <div className="choice-list">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`choice${feedback && opt === phrase.pt ? ' correct' : ''}${feedback === 'bad' && opt !== phrase.pt ? '' : ''}`}
              onClick={() => pick(opt)}
              disabled={!!feedback}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

function MatchGame({
  topic,
  progress,
  onProgress,
  onExit,
}: {
  topic: Topic
  progress: Progress
  onProgress: (p: Progress) => void
  onExit: () => void
}) {
  const pairs = useMemo(() => shuffle(topic.phrases).slice(0, 6), [topic])
  const [enOrder] = useState(() => shuffle(pairs.map((p) => p.id)))
  const [ptOrder] = useState(() => shuffle(pairs.map((p) => p.id)))
  const [selectedEn, setSelectedEn] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])

  const byId = Object.fromEntries(pairs.map((p) => [p.id, p]))

  function selectEn(id: string) {
    if (matched.includes(id)) return
    setSelectedEn(id)
  }

  function selectPt(id: string) {
    if (!selectedEn || matched.includes(id)) return
    if (selectedEn === id) {
      const next = [...matched, id]
      setMatched(next)
      onProgress(addXp(progress, 6))
      setSelectedEn(null)
      if (next.length === pairs.length) {
        onProgress(markModeDone(progress, topic.id, 'match-game'))
        setTimeout(onExit, 600)
      }
    } else {
      setSelectedEn(null)
    }
  }

  return (
    <main className="page">
      <button type="button" className="back-link" onClick={onExit}>
        ← Jogos
      </button>
      <div className="section-head">
        <h2>Match</h2>
        <p>
          {matched.length}/{pairs.length} pares
        </p>
      </div>
      <ProgressBar value={matched.length} max={pairs.length} />
      <div className="match-board">
        <div className="match-col">
          {enOrder.map((id) => (
            <button
              key={`en-${id}`}
              type="button"
              className={`match-item${selectedEn === id ? ' selected' : ''}${matched.includes(id) ? ' matched' : ''}`}
              onClick={() => selectEn(id)}
            >
              {byId[id].en}
            </button>
          ))}
        </div>
        <div className="match-col">
          {ptOrder.map((id) => (
            <button
              key={`pt-${id}`}
              type="button"
              className={`match-item${matched.includes(id) ? ' matched' : ''}`}
              onClick={() => selectPt(id)}
            >
              {byId[id].pt}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

function ScrambleGame({
  topic,
  progress,
  onProgress,
  onExit,
}: {
  topic: Topic
  progress: Progress
  onProgress: (p: Progress) => void
  onExit: () => void
}) {
  const rounds = useMemo(() => shuffle(topic.phrases).slice(0, 6), [topic])
  const [index, setIndex] = useState(0)
  const phrase = rounds[index]
  const words = useMemo(() => phrase.en.replace(/[.?!,]/g, '').split(/\s+/), [phrase])
  const [pool, setPool] = useState(() => shuffle(words))
  const [built, setBuilt] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'ok' | 'bad' | null>(null)

  function resetRound(nextIndex = index) {
    const nextWords = rounds[nextIndex].en.replace(/[.?!,]/g, '').split(/\s+/)
    setPool(shuffle(nextWords))
    setBuilt([])
    setFeedback(null)
  }

  function addWord(word: string, i: number) {
    setBuilt((b) => [...b, word])
    setPool((p) => p.filter((_, idx) => idx !== i))
  }

  function removeWord(i: number) {
    const word = built[i]
    setBuilt((b) => b.filter((_, idx) => idx !== i))
    setPool((p) => [...p, word])
  }

  function check() {
    const answer = words.join(' ').toLowerCase()
    const attempt = built.join(' ').toLowerCase()
    const ok = answer === attempt
    setFeedback(ok ? 'ok' : 'bad')
    if (ok) {
      onProgress(addXp(progress, 8))
      setTimeout(() => {
        if (index >= rounds.length - 1) {
          onProgress(markModeDone(progress, topic.id, 'scramble-game'))
          onExit()
          return
        }
        const next = index + 1
        setIndex(next)
        resetRound(next)
      }, 700)
    }
  }

  return (
    <main className="page">
      <button type="button" className="back-link" onClick={onExit}>
        ← Jogos
      </button>
      <div className="section-head">
        <h2>Scramble</h2>
        <p>
          Frase {index + 1}/{rounds.length} — {phrase.pt}
        </p>
      </div>
      <ProgressBar value={index + 1} max={rounds.length} />
      <div className="panel panel-wide">
        <ListenButton text={phrase.en} label="Ouvir dica" />
        <div className="scramble-words">
          {built.map((w, i) => (
            <button key={`b-${w}-${i}`} type="button" className="word-chip" onClick={() => removeWord(i)}>
              {w}
            </button>
          ))}
        </div>
        <div className="scramble-words">
          {pool.map((w, i) => (
            <button
              key={`p-${w}-${i}`}
              type="button"
              className="word-chip pool"
              onClick={() => addWord(w, i)}
            >
              {w}
            </button>
          ))}
        </div>
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={check} disabled={!built.length}>
            Conferir
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => resetRound()}>
            Limpar
          </button>
        </div>
        {feedback === 'ok' && <p className="feedback ok">Montou certo!</p>}
        {feedback === 'bad' && <p className="feedback bad">Quase — tenta de novo.</p>}
      </div>
    </main>
  )
}
