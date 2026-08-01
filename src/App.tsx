import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { loadProgress, saveProgress, touchStreak, type Progress } from './lib/progress'
import {
  pathFromRoute,
  pushRoute,
  replaceRoute,
  routeFromPath,
  type RouteState,
  type Screen,
} from './lib/routing'
import { Home } from './pages/Home'
import { Topics } from './pages/Topics'
import { TopicModes } from './pages/TopicModes'
import { Lesson } from './pages/Lesson'
import { Quiz } from './pages/Quiz'
import { Speak } from './pages/Speak'
import { Games } from './pages/Games'
import { ProgressPage } from './pages/Progress'

export type { Screen }

export default function App() {
  const initial = routeFromPath(window.location.pathname)
  const [screen, setScreen] = useState<Screen>(initial.screen)
  const [topicId, setTopicId] = useState<string | null>(initial.topicId)
  const [progress, setProgress] = useState<Progress>(() => loadProgress())

  useEffect(() => {
    setProgress((p) => {
      const next = touchStreak(p)
      saveProgress(next)
      return next
    })
    // Normalize current URL so refresh/deep-link stays consistent.
    replaceRoute(routeFromPath(window.location.pathname))
  }, [])

  useEffect(() => {
    function onPopState() {
      const route = routeFromPath(window.location.pathname)
      setScreen(route.screen)
      setTopicId(route.topicId)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function go(next: RouteState) {
    const current: RouteState = { screen, topicId }
    const nextPath = pathFromRoute(next)
    if (pathFromRoute(current) === nextPath) {
      setScreen(next.screen)
      setTopicId(next.topicId)
      return
    }
    pushRoute(next)
    setScreen(next.screen)
    setTopicId(next.topicId)
  }

  function updateProgress(next: Progress) {
    saveProgress(next)
    setProgress(next)
  }

  function openTopic(id: string) {
    go({ screen: 'topic-modes', topicId: id })
  }

  function navigate(next: Screen) {
    if (next === 'games') {
      go({ screen: 'games', topicId })
      return
    }
    if (next === 'home' || next === 'topics' || next === 'progress') {
      go({ screen: next, topicId: null })
    }
  }

  const showNav = screen !== 'home'

  return (
    <Layout screen={screen} progress={progress} onNavigate={navigate} showNav={showNav}>
      {screen === 'home' && (
        <Home
          onStart={() => go({ screen: 'topics', topicId: null })}
          onGames={() => go({ screen: 'games', topicId: null })}
        />
      )}
      {screen === 'topics' && <Topics progress={progress} onOpen={openTopic} />}
      {screen === 'topic-modes' && topicId && (
        <TopicModes
          topicId={topicId}
          onBack={() => go({ screen: 'topics', topicId: null })}
          onLesson={() => go({ screen: 'lesson', topicId })}
          onQuiz={() => go({ screen: 'quiz', topicId })}
          onSpeak={() => go({ screen: 'speak', topicId })}
          onGames={() => go({ screen: 'games', topicId })}
        />
      )}
      {screen === 'lesson' && topicId && (
        <Lesson
          topicId={topicId}
          progress={progress}
          onProgress={updateProgress}
          onBack={() => go({ screen: 'topic-modes', topicId })}
          onQuiz={() => go({ screen: 'quiz', topicId })}
        />
      )}
      {screen === 'quiz' && topicId && (
        <Quiz
          topicId={topicId}
          progress={progress}
          onProgress={updateProgress}
          onBack={() => go({ screen: 'topic-modes', topicId })}
          onSpeak={() => go({ screen: 'speak', topicId })}
        />
      )}
      {screen === 'speak' && topicId && (
        <Speak
          topicId={topicId}
          progress={progress}
          onProgress={updateProgress}
          onBack={() => go({ screen: 'topic-modes', topicId })}
        />
      )}
      {screen === 'games' && (
        <Games
          topicId={topicId || undefined}
          progress={progress}
          onProgress={updateProgress}
          onBack={() =>
            go(topicId ? { screen: 'topic-modes', topicId } : { screen: 'home', topicId: null })
          }
          onPickTopic={(id) => go({ screen: 'games', topicId: id })}
        />
      )}
      {screen === 'progress' && (
        <ProgressPage
          progress={progress}
          onTopics={() => go({ screen: 'topics', topicId: null })}
        />
      )}
    </Layout>
  )
}
