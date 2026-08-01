import { useEffect, useRef, useState } from 'react'
import { canListen, startListening, type ListenHandle } from '../lib/speech'

type Props = {
  onFinal: (transcript: string) => void
  onInterim?: (transcript: string) => void
  disabled?: boolean
}

export function SpeakButton({ onFinal, onInterim, disabled }: Props) {
  const [listening, setListening] = useState(false)
  const handleRef = useRef<ListenHandle | null>(null)

  useEffect(() => {
    return () => handleRef.current?.stop()
  }, [])

  function toggle() {
    if (!canListen()) {
      alert('Microfone por voz precisa de Chrome ou Edge (e permissão do mic).')
      return
    }

    if (listening) {
      handleRef.current?.stop()
      setListening(false)
      return
    }

    setListening(true)
    handleRef.current = startListening({
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          onFinal(transcript)
          setListening(false)
        } else {
          onInterim?.(transcript)
        }
      },
      onError: (message) => {
        alert(message)
        setListening(false)
      },
      onEnd: () => setListening(false),
    })
  }

  return (
    <button
      type="button"
      className={`icon-btn${listening ? ' listening' : ''}`}
      onClick={toggle}
      disabled={disabled}
    >
      <span aria-hidden>{listening ? '⏺' : '🎤'}</span>
      {listening ? 'Ouvindo… toca pra parar' : 'Fala aí'}
    </button>
  )
}
