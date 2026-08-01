import { art } from '../data/art'
import { FaunaParade } from '../components/FaunaParade'

type Props = {
  onStart: () => void
  onGames: () => void
}

export function Home({ onStart, onGames }: Props) {
  return (
    <>
      <main className="page hero">
        <div className="hero-stage" aria-hidden="true">
          <img className="hero-glow-roses" src={art.blueRoses} alt="" />
          <img className="hero-glow-roses-b" src={art.rosesMix} alt="" />
          <img className="hero-float hero-macaw" src={art.macaw} alt="" />
          <img className="hero-float hero-toucan" src={art.toucan} alt="" />
          <img className="hero-float hero-blue-macaw" src={art.blueMacaw} alt="" />
          <img className="hero-float hero-capy" src={art.capybara} alt="" />
          <img className="hero-float hero-monkey" src={art.marmoset} alt="" />
          <img className="hero-float hero-jaguar" src={art.jaguar} alt="" />
          <img className="hero-float hero-sloth" src={art.sloth} alt="" />
        </div>

        <div className="hero-copy">
          <div className="hero-inner">
            <div className="hero-brand">
              <span>Nessa</span>
              <em>English</em>
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
          </div>
        </div>

        <div className="hero-portrait" aria-hidden="true">
          <img className="hero-character" src={art.nessa} alt="" />
        </div>
      </main>
      <FaunaParade />
    </>
  )
}
