import { useState } from 'react'
import { canSpeak, speak, stopSpeaking } from '../lib/speech'

type Props = {
  text: string
  label?: string
  onSpoken?: () => void
}

export function ListenButton({ text, label = 'Ouvir', onSpoken }: Props) {
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (!canSpeak()) {
      alert('Seu navegador não tem voz embutida. Abre no Chrome ou Edge.')
      return
    }
    try {
      setBusy(true)
      stopSpeaking()
      await speak(text)
      onSpoken?.()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Não rolou o áudio.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" className={`icon-btn${busy ? ' listening' : ''}`} onClick={handleClick}>
      <span aria-hidden>🔊</span>
      {busy ? 'Falando…' : label}
    </button>
  )
}
