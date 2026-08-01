# Nessa English

App web pra Nessa aprender inglês de um jeito divertido: temas do dia a dia (praia no Rio, dating, trabalho, viagem…), quizzes, jogos e prática falando.

## Rodar local

```bash
npm install
npm run dev
```

Abre o endereço que o Vite mostrar (geralmente `http://localhost:5173`).

## Voz gratuita (sem API key)

A app usa a **Web Speech API** do navegador:

- **Ouvir frases** — `speechSynthesis` (funciona na maioria dos navegadores)
- **Falar e praticar** — `SpeechRecognition` (melhor no **Chrome** ou **Edge**)

No modo **Fala aí**, o navegador vai pedir permissão de microfone. Aceita pra comparar tua pronúncia com a frase.

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — prévia do build

## Repo

https://github.com/maxiberonuntitle/aprendeinglesnessa
