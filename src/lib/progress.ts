const KEY = 'nessa-english-progress-v1'

export type Progress = {
  xp: number
  streak: number
  lastActiveDate: string | null
  completedTopics: string[]
  completedModes: Record<string, string[]>
  heardPhrases: string[]
}

const empty: Progress = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedTopics: [],
  completedModes: {},
  heardPhrases: [],
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...empty, completedModes: {} }
    const parsed = JSON.parse(raw) as Progress
    return {
      ...empty,
      ...parsed,
      completedModes: parsed.completedModes || {},
      completedTopics: parsed.completedTopics || [],
      heardPhrases: parsed.heardPhrases || [],
    }
  } catch {
    return { ...empty, completedModes: {} }
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(progress))
}

export function touchStreak(progress: Progress): Progress {
  const t = today()
  if (progress.lastActiveDate === t) return progress
  const nextStreak =
    progress.lastActiveDate === yesterday() ? progress.streak + 1 : 1
  return { ...progress, streak: nextStreak, lastActiveDate: t }
}

export function addXp(progress: Progress, amount: number): Progress {
  return touchStreak({ ...progress, xp: progress.xp + amount })
}

export function markHeard(progress: Progress, phraseId: string): Progress {
  if (progress.heardPhrases.includes(phraseId)) return progress
  return { ...progress, heardPhrases: [...progress.heardPhrases, phraseId] }
}

export function markModeDone(
  progress: Progress,
  topicId: string,
  mode: string,
): Progress {
  const modes = new Set(progress.completedModes[topicId] || [])
  modes.add(mode)
  const completedModes = {
    ...progress.completedModes,
    [topicId]: [...modes],
  }
  const completeEnough = modes.size >= 3
  const completedTopics = completeEnough
    ? Array.from(new Set([...progress.completedTopics, topicId]))
    : progress.completedTopics
  return addXp({ ...progress, completedModes, completedTopics }, 15)
}
