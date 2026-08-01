import { faunaParade } from '../data/art'

export function FaunaParade() {
  return (
    <section className="fauna-parade" aria-label="Fauna e flores do Brasil">
      <div className="fauna-parade-track">
        {[...faunaParade, ...faunaParade].map((item, i) => (
          <figure key={`${item.label}-${i}`} className="fauna-parade-item">
            <img src={item.src} alt={item.alt} loading="lazy" />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
