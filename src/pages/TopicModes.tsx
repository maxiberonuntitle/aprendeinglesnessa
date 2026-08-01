import { getTopic } from '../data/topics'
import { topicArt } from '../data/art'

type Props = {
  topicId: string
  onBack: () => void
  onLesson: () => void
  onQuiz: () => void
  onSpeak: () => void
  onGames: () => void
}

export function TopicModes({
  topicId,
  onBack,
  onLesson,
  onQuiz,
  onSpeak,
  onGames,
}: Props) {
  const topic = getTopic(topicId)
  if (!topic) {
    return (
      <main className="page">
        <p>Tema não encontrado.</p>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Voltar
        </button>
      </main>
    )
  }

  const cover = topicArt[topic.id]

  return (
    <main className="page">
      <button type="button" className="back-link" onClick={onBack}>
        ← Temas
      </button>
      {cover && (
        <div className="topic-hero-art">
          <img src={cover} alt="" />
        </div>
      )}
      <div className="section-head">
        <h2>
          {topic.emoji} {topic.title}
        </h2>
        <p>{topic.blurb} Faz o ciclo: ouvir → quiz → falar → jogos.</p>
      </div>
      <div className="mode-picks">
        <button type="button" className="mode-pick" onClick={onLesson}>
          <h3>🎧 Lição</h3>
          <p>Escuta a frase, vê a tradução e o tip carioca-friendly.</p>
        </button>
        <button type="button" className="mode-pick" onClick={onQuiz}>
          <h3>🧠 Quiz</h3>
          <p>Múltipla escolha e complete a lacuna.</p>
        </button>
        <button type="button" className="mode-pick" onClick={onSpeak}>
          <h3>🎤 Fala aí</h3>
          <p>Repete com o microfone e vê tua pontuação.</p>
        </button>
        <button type="button" className="mode-pick" onClick={onGames}>
          <h3>🎮 Jogos</h3>
          <p>Escuta, match e scramble com esse tema.</p>
        </button>
      </div>
    </main>
  )
}
