import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChatGptAiService } from './services/ai/ChatGptAiService.ts'

const aiService = new ChatGptAiService()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App aiService={aiService} />
  </StrictMode>,
)
