import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import FormField from './components/FormField'
import PromptOutput from './components/PromptOutput'
import { createInitialValues, fields } from './constants/fields'
import type { FormValues } from './types/promptCanvas'
import { assemblePrompt } from './utils/promptAssembly'

function App() {
  const [values, setValues] = useState<FormValues>(() => createInitialValues())
  const [assembledPrompt, setAssembledPrompt] = useState('')

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

  return (
    <main className="page">
      <section className="canvas">
        <h1>PromptCanvas</h1>
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
    </main>
  )
}

export default App
