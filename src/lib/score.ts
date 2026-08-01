function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Similarity 0–100 based on token overlap + length closeness. */
export function phraseSimilarity(expected: string, heard: string): number {
  const a = normalize(expected)
  const b = normalize(heard)
  if (!a || !b) return 0
  if (a === b) return 100

  const aTokens = a.split(' ')
  const bTokens = new Set(b.split(' '))
  const hits = aTokens.filter((t) => bTokens.has(t)).length
  const tokenScore = (hits / aTokens.length) * 100

  const lenRatio =
    Math.min(a.length, b.length) / Math.max(a.length, b.length || 1)
  const includesBonus = b.includes(a) || a.includes(b) ? 15 : 0

  return Math.min(100, Math.round(tokenScore * 0.75 + lenRatio * 25 + includesBonus))
}

export function scoreLabel(score: number): string {
  if (score >= 90) return 'Nailed it, Nessa!'
  if (score >= 75) return 'Quase nativo — mandou bem'
  if (score >= 55) return 'Boa! Mais uma vez e cola'
  return 'Tenta de novo ouvindo a frase'
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
