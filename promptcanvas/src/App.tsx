import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import Button from './components/Button'
import FormField from './components/FormField'
import PromptOutput from './components/PromptOutput'
import { createInitialValues, fields } from './constants/fields'
import type { FormValues } from './types/promptCanvas'
import { assemblePrompt } from './utils/promptAssembly'

const GOOGLE_API_KEY_STORAGE_KEY = 'promptcanvas.googleApiKey'
const GEMINI_MODEL = 'gemini-2.0-flash'

const formatGeminiResponse = (response: unknown) => JSON.stringify(response, null, 2)

function App() {
  const [values, setValues] = useState<FormValues>(() => createInitialValues())
  const [assembledPrompt, setAssembledPrompt] = useState('')
  const [geminiResponse, setGeminiResponse] = useState('')
  const [isGeminiLoading, setIsGeminiLoading] = useState(false)
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false)
  const [googleApiKeyInput, setGoogleApiKeyInput] = useState(
    () => localStorage.getItem(GOOGLE_API_KEY_STORAGE_KEY) ?? '',
  )
  const [keySavedNotice, setKeySavedNotice] = useState('')

  const promptPreview = useMemo(() => assembledPrompt, [assembledPrompt])

  const requestGemini = async () => {
    if (!assembledPrompt.trim()) {
      setGeminiResponse(
        JSON.stringify({ error: 'Assemble a payload before sending the Gemini request.' }, null, 2),
      )
      return
    }

    const payload = assembledPrompt
    setGeminiResponse('')

    const apiKey = localStorage.getItem(GOOGLE_API_KEY_STORAGE_KEY)?.trim() ?? ''
    if (!apiKey) {
      setGeminiResponse(
        JSON.stringify(
          { error: 'Missing Google API key. Open "Google API Key" and save a valid key first.' },
          null,
          2,
        ),
      )
      return
    }

    setIsGeminiLoading(true)
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: payload }] }],
          }),
        },
      )

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}))
        setGeminiResponse(
          JSON.stringify(
            {
              error: 'Gemini API request failed.',
              status: response.status,
              details: errorPayload,
            },
            null,
            2,
          ),
        )
        return
      }

      const responsePayload = await response.json()
      setGeminiResponse(formatGeminiResponse(responsePayload))
    } catch (error) {
      setGeminiResponse(
        JSON.stringify(
          {
            error: 'Unable to reach Gemini API.',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          null,
          2,
        ),
      )
    } finally {
      setIsGeminiLoading(false)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setAssembledPrompt(assemblePrompt(values))
    setGeminiResponse('')
  }

  const updateStringField = (fieldId: string, nextValue: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: nextValue }))
  }

  const updateBooleanField = (fieldId: string, nextValue: boolean) => {
    setValues((prev) => ({ ...prev, [fieldId]: nextValue }))
  }

  const updateListField = (fieldId: string, index: number, nextValue: string) => {
    setValues((prev) => {
      const currentList = [...(prev[fieldId] as string[])]
      currentList[index] = nextValue
      return { ...prev, [fieldId]: currentList }
    })
  }

  const addListItem = (fieldId: string) => {
    setValues((prev) => {
      const currentList = [...(prev[fieldId] as string[])]
      return { ...prev, [fieldId]: [...currentList, ''] }
    })
  }

  const removeListItem = (fieldId: string, index: number) => {
    setValues((prev) => {
      const currentList = [...(prev[fieldId] as string[])]
      if (currentList.length === 1) return prev
      currentList.splice(index, 1)
      return { ...prev, [fieldId]: currentList }
    })
  }

  const openKeyDialog = () => {
    setIsKeyDialogOpen(true)
    setKeySavedNotice('')
    setGoogleApiKeyInput(localStorage.getItem(GOOGLE_API_KEY_STORAGE_KEY) ?? '')
  }

  const closeKeyDialog = () => {
    setIsKeyDialogOpen(false)
    setKeySavedNotice('')
  }

  const onSaveGoogleApiKey = (event: FormEvent) => {
    event.preventDefault()
    localStorage.setItem(GOOGLE_API_KEY_STORAGE_KEY, googleApiKeyInput.trim())
    setKeySavedNotice('Google API key saved locally.')
  }

  return (
    <main className="page">
      <section className="canvas">
        <div className="canvasHeader">
          <h1>PromptCanvas</h1>
          <Button type="button" variant="secondary" className="apiKeyBtn" onClick={openKeyDialog}>
            Google API Key
          </Button>
        </div>
        <p className="subtitle">Build a structured Gemini prompt using guided sections.</p>

        <form className="form" onSubmit={onSubmit}>
          {fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={values[field.id]}
              onStringChange={updateStringField}
              onBooleanChange={updateBooleanField}
              onListItemChange={updateListField}
              onListItemAdd={addListItem}
              onListItemRemove={removeListItem}
            />
          ))}

          <Button type="submit">
            Assemble Prompt
          </Button>
        </form>
      </section>

      <PromptOutput
        value={promptPreview}
        responseValue={geminiResponse}
        isLoadingResponse={isGeminiLoading}
        onRequest={requestGemini}
      />

      {isKeyDialogOpen && (
        <div className="dialogOverlay" role="presentation" onClick={closeKeyDialog}>
          <section
            className="dialogCard"
            role="dialog"
            aria-modal="true"
            aria-labelledby="google-api-key-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="google-api-key-title">Google API Key</h2>
            <p className="subtitle">Paste your key below to store it in local browser storage.</p>
            <form className="dialogForm" onSubmit={onSaveGoogleApiKey}>
              <label htmlFor="google-api-key-input">API key</label>
              <input
                id="google-api-key-input"
                type="password"
                value={googleApiKeyInput}
                onChange={(event) => setGoogleApiKeyInput(event.target.value)}
                autoComplete="off"
                placeholder="AIza..."
              />
              <div className="dialogActions">
                <Button type="submit">
                  Save
                </Button>
                <Button type="button" variant="secondary" onClick={closeKeyDialog}>
                  Close
                </Button>
              </div>
              {keySavedNotice && <p className="savedNotice">{keySavedNotice}</p>}
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
