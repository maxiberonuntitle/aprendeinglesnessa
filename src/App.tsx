import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { loadProgress, saveProgress, touchStreak, type Progress } from './lib/progress'
import { Home } from './pages/Home'
import { Topics } from './pages/Topics'
import { TopicModes } from './pages/TopicModes'
import { Lesson } from './pages/Lesson'
import { Quiz } from './pages/Quiz'
import { Speak } from './pages/Speak'
import { Games } from './pages/Games'
import { ProgressPage } from './pages/Progress'

export type Screen =
  | 'home'
  | 'topics'
  | 'topic-modes'
  | 'lesson'
  | 'quiz'
  | 'speak'
  | 'games'
  | 'progress'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [topicId, setTopicId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Progress>(() => loadProgress())

  useEffect(() => {
    setProgress((p) => {
      const next = touchStreak(p)
      saveProgress(next)
      return next
    })
  }, [])

  function updateProgress(next: Progress) {
    saveProgress(next)
    setProgress(next)
  }

  function openTopic(id: string) {
    setTopicId(id)
    setScreen('topic-modes')
  }

  function navigate(next: Screen) {
    if (next === 'games') {
      setScreen('games')
      return
    }
    if (next === 'topics' || next === 'home' || next === 'progress') {
      setScreen(next)
    }
  }

  const showNav = screen !== 'home'

  return (
    <Layout screen={screen} progress={progress} onNavigate={navigate} showNav={showNav}>
      {screen === 'home' && (
        <Home onStart={() => setScreen('topics')} onGames={() => setScreen('games')} />
      )}
      {screen === 'topics' && <Topics progress={progress} onOpen={openTopic} />}
      {screen === 'topic-modes' && topicId && (
        <TopicModes
          topicId={topicId}
          onBack={() => setScreen('topics')}
          onLesson={() => setScreen('lesson')}
          onQuiz={() => setScreen('quiz')}
          onSpeak={() => setScreen('speak')}
          onGames={() => setScreen('games')}
        />
      )}
      {screen === 'lesson' && topicId && (
        <Lesson
          topicId={topicId}
          progress={progress}
          onProgress={updateProgress}
          onBack={() => setScreen('topic-modes')}
          onQuiz={() => setScreen('quiz')}
        />
      )}
      {screen === 'quiz' && topicId && (
        <Quiz
          topicId={topicId}
          progress={progress}
          onProgress={updateProgress}
          onBack={() => setScreen('topic-modes')}
          onSpeak={() => setScreen('speak')}
        />
      )}
      {screen === 'speak' && topicId && (
        <Speak
          topicId={topicId}
          progress={progress}
          onProgress={updateProgress}
          onBack={() => setScreen('topic-modes')}
        />
      )}
      {screen === 'games' && (
        <Games
          topicId={topicId || undefined}
          progress={progress}
          onProgress={updateProgress}
          onBack={() => setScreen(topicId ? 'topic-modes' : 'home')}
          onPickTopic={(id) => {
            setTopicId(id)
            setScreen('games')
          }}
        />
      )}
      {screen === 'progress' && (
        <ProgressPage progress={progress} onTopics={() => setScreen('topics')} />
      )}
    </Layout>
  )
}
