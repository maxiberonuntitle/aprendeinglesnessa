import { art } from '../data/art'

type Props = {
  dense?: boolean
}

export function FaunaField({ dense = false }: Props) {
  return (
    <div className={`fauna-field${dense ? ' dense' : ''}`} aria-hidden="true">
      <img src={art.blueRoses} alt="" className="fauna-piece f-roses-a" loading="lazy" />
      <img src={art.rosesMix} alt="" className="fauna-piece f-roses-b" loading="lazy" />
      <img src={art.macaw} alt="" className="fauna-piece f-macaw" loading="lazy" />
      <img src={art.toucan} alt="" className="fauna-piece f-toucan" loading="lazy" />
      <img src={art.marmoset} alt="" className="fauna-piece f-monkey" loading="lazy" />
      <img src={art.capybara} alt="" className="fauna-piece f-capy" loading="lazy" />
      {!dense && (
        <>
          <img src={art.sloth} alt="" className="fauna-piece f-sloth" loading="lazy" />
          <img src={art.blueMacaw} alt="" className="fauna-piece f-blue-macaw" loading="lazy" />
        </>
      )}
    </div>
  )
}
