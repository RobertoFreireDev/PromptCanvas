import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import FormField from './components/FormField'
import PromptOutput from './components/PromptOutput'
import { createInitialValues, fields } from './constants/fields'
import type { FormValues } from './types/promptCanvas'
import { assemblePrompt } from './utils/promptAssembly'

const GOOGLE_API_KEY_STORAGE_KEY = 'promptcanvas.googleApiKey'

function App() {
  const [values, setValues] = useState<FormValues>(() => createInitialValues())
  const [assembledPrompt, setAssembledPrompt] = useState('')
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false)
  const [googleApiKeyInput, setGoogleApiKeyInput] = useState(
    () => localStorage.getItem(GOOGLE_API_KEY_STORAGE_KEY) ?? '',
  )
  const [keySavedNotice, setKeySavedNotice] = useState('')

  const promptPreview = useMemo(() => assembledPrompt, [assembledPrompt])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setAssembledPrompt(assemblePrompt(values))
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
          <button type="button" className="secondaryBtn apiKeyBtn" onClick={openKeyDialog}>
            Google API Key
          </button>
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

          <button type="submit" className="submitBtn">
            Assemble Prompt
          </button>
        </form>
      </section>

      <PromptOutput value={promptPreview} />

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
                <button type="submit" className="submitBtn">
                  Save
                </button>
                <button type="button" className="secondaryBtn" onClick={closeKeyDialog}>
                  Close
                </button>
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
