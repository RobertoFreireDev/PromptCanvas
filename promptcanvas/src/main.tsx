import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GeminiAiService } from './services/ai/GeminiAiService.ts'

const aiService = new GeminiAiService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App aiService={aiService} />
  </StrictMode>,
)
