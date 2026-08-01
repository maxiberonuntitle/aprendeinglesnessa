export const art = {
  macaw: '/art/macaw.png',
  blueMacaw: '/art/blue-macaw.png',
  toucan: '/art/toucan.png',
  capybara: '/art/capybara.png',
  jaguar: '/art/jaguar.png',
  marmoset: '/art/marmoset.png',
  sloth: '/art/sloth.png',
  blueRoses: '/art/blue-roses.png',
  rosesMix: '/art/roses-mix.png',
  nessa: '/art/nessa-character.png',
} as const

export const topicArt: Record<string, string> = {
  'praia-rio': art.macaw,
  'dating-apps': art.blueRoses,
  trabalho: art.jaguar,
  viagem: art.toucan,
  comida: art.capybara,
  amigas: art.marmoset,
  streaming: art.blueMacaw,
  emergencias: art.sloth,
  'dia-a-dia': art.rosesMix,
}

export const faunaParade = [
  { src: art.macaw, alt: 'Arara vermelha', label: 'Arara' },
  { src: art.toucan, alt: 'Tucano', label: 'Tucano' },
  { src: art.capybara, alt: 'Capivara', label: 'Capivara' },
  { src: art.jaguar, alt: 'Onça-pintada', label: 'Onça' },
  { src: art.marmoset, alt: 'Sagui', label: 'Sagui' },
  { src: art.sloth, alt: 'Bicho-preguiça', label: 'Preguiça' },
  { src: art.blueMacaw, alt: 'Arara-canindé', label: 'Canindé' },
  { src: art.blueRoses, alt: 'Rosas azuis', label: 'Rosas' },
]
