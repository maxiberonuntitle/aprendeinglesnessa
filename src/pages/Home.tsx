type Props = {
  onStart: () => void
  onGames: () => void
}

export function Home({ onStart, onGames }: Props) {
  return (
    <main className="page hero">
      <div className="hero-brand">
        Nessa <em>English</em>
      </div>
      <h1>Inglês com vibe de Rio — pra você brilhar falando.</h1>
      <p>
        Temas do seu dia, jogos rápidos e voz grátis do navegador pra ouvir e treinar
        cada frase. Sem enrolação, só progresso gostoso.
      </p>
      <div className="cta-row">
        <button type="button" className="btn btn-primary" onClick={onStart}>
          Começar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onGames}>
          Ir pros jogos
        </button>
      </div>
    </main>
  )
}
