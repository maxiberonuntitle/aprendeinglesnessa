let preferredVoice: SpeechSynthesisVoice | null = null

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return preferredVoice

  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  preferredVoice =
    enVoices.find((v) => /female|woman|zira|samantha|google us english/i.test(v.name)) ||
    enVoices.find((v) => v.lang.toLowerCase().includes('en-us')) ||
    enVoices[0] ||
    null
  return preferredVoice
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    pickVoice()
  }
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(
  text: string,
  options: { rate?: number; voiceHint?: string } = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!canSpeak()) {
      reject(new Error('Seu navegador não suporta voz. Tente Chrome ou Edge.'))
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = options.voiceHint || 'en-US'
    utterance.rate = options.rate ?? 0.92
    const voice = pickVoice()
    if (voice) utterance.voice = voice

    utterance.onend = () => resolve()
    utterance.onerror = () => reject(new Error('Não consegui falar essa frase agora.'))
    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel()
}

export function canListen(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  )
}

export type ListenHandle = {
  stop: () => void
}

export function startListening(handlers: {
  onResult: (transcript: string, isFinal: boolean) => void
  onError?: (message: string) => void
  onEnd?: () => void
}): ListenHandle {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Recognition) {
    handlers.onError?.('Reconhecimento de voz não disponível. Use Chrome ou Edge.')
    return { stop: () => undefined }
  }

  const recognition = new Recognition()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1]
    const transcript = result?.[0]?.transcript ?? ''
    handlers.onResult(transcript, result?.isFinal ?? false)
  }

  recognition.onerror = (event) => {
    const map: Record<string, string> = {
      'not-allowed': 'Permita o microfone no navegador pra praticar falando.',
      'no-speech': 'Não ouvi nada — tenta de novo mais perto do mic.',
      network: 'Erro de rede no reconhecimento. Tenta outra vez.',
      aborted: 'Escuta cancelada.',
    }
    handlers.onError?.(map[event.error] || `Erro de voz: ${event.error}`)
  }

  recognition.onend = () => handlers.onEnd?.()
  recognition.start()

  return {
    stop: () => {
      try {
        recognition.stop()
      } catch {
        /* ignore */
      }
    },
  }
}
