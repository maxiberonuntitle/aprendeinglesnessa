export type Screen =
  | 'home'
  | 'topics'
  | 'topic-modes'
  | 'lesson'
  | 'quiz'
  | 'speak'
  | 'games'
  | 'progress'

export type RouteState = {
  screen: Screen
  topicId: string | null
}

export function pathFromRoute(route: RouteState): string {
  const { screen, topicId } = route
  switch (screen) {
    case 'home':
      return '/'
    case 'topics':
      return '/temas'
    case 'progress':
      return '/progresso'
    case 'games':
      return topicId ? `/jogos/${topicId}` : '/jogos'
    case 'topic-modes':
      return topicId ? `/tema/${topicId}` : '/temas'
    case 'lesson':
      return topicId ? `/tema/${topicId}/licao` : '/temas'
    case 'quiz':
      return topicId ? `/tema/${topicId}/quiz` : '/temas'
    case 'speak':
      return topicId ? `/tema/${topicId}/fala` : '/temas'
    default:
      return '/'
  }
}

export function routeFromPath(pathname: string): RouteState {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/' || path === '') return { screen: 'home', topicId: null }
  if (path === '/temas') return { screen: 'topics', topicId: null }
  if (path === '/progresso') return { screen: 'progress', topicId: null }
  if (path === '/jogos') return { screen: 'games', topicId: null }

  const gamesMatch = path.match(/^\/jogos\/([^/]+)$/)
  if (gamesMatch) return { screen: 'games', topicId: gamesMatch[1] }

  const topicMatch = path.match(/^\/tema\/([^/]+)(?:\/(licao|quiz|fala))?$/)
  if (topicMatch) {
    const topicId = topicMatch[1]
    const mode = topicMatch[2]
    if (mode === 'licao') return { screen: 'lesson', topicId }
    if (mode === 'quiz') return { screen: 'quiz', topicId }
    if (mode === 'fala') return { screen: 'speak', topicId }
    return { screen: 'topic-modes', topicId }
  }

  return { screen: 'home', topicId: null }
}

export function pushRoute(route: RouteState): void {
  const path = pathFromRoute(route)
  if (window.location.pathname === path) return
  window.history.pushState(route, '', path)
}

export function replaceRoute(route: RouteState): void {
  const path = pathFromRoute(route)
  window.history.replaceState(route, '', path)
}
