import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type FieldType = 'string' | 'string[]' | 'boolean'

type FieldConfig = {
  id: string
  label: string
  type: FieldType
}

const fields: FieldConfig[] = [
  { id: 'taskContext', label: 'Task context', type: 'string' },
  { id: 'tone', label: 'Tone context', type: 'string' },
  { id: 'backgroundData', label: 'Background data', type: 'string[]' },
  { id: 'rules', label: 'Detailed task description & rules', type: 'string[]' },
  { id: 'examples', label: 'Examples', type: 'string[]' },
  {
    id: 'conversationHistory',
    label: 'Include conversation history',
    type: 'boolean',
  },
  { id: 'task', label: 'Immediate task', type: 'string' },
  { id: 'reasoning', label: 'Thinking step by step', type: 'string[]' },
  { id: 'outputFormat', label: 'Output formatting', type: 'string' },
  { id: 'prefilledResponse', label: 'Prefilled response', type: 'string' },
]

type FormValues = Record<string, string | string[] | boolean>

const createInitialValues = (): FormValues => {
  const values: FormValues = {}

  for (const field of fields) {
    if (field.type === 'string') values[field.id] = ''
    if (field.type === 'string[]') values[field.id] = ['']
    if (field.type === 'boolean') values[field.id] = false
  }

  return values
}

function App() {
  const [values, setValues] = useState<FormValues>(() => createInitialValues())
  const [assembledPrompt, setAssembledPrompt] = useState('')

  const promptPreview = useMemo(() => assembledPrompt, [assembledPrompt])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    const lines = [
      `- Task Context: ${values.taskContext as string}`,
      `- Tone: ${values.tone as string}`,
      `- Background Data: ${formatList(values.backgroundData as string[])}`,
      `- Rules: ${formatList(values.rules as string[])}`,
      `- Examples: ${formatList(values.examples as string[])}`,
      `- Conversation History: ${(values.conversationHistory as boolean) ? 'Included' : 'Not included'}`,
      `- Immediate Task: ${values.task as string}`,
      `- Reasoning Guidance: ${formatList(values.reasoning as string[])}`,
      `- Output Format: ${values.outputFormat as string}`,
      `- Prefilled Response: ${values.prefilledResponse as string}`,
    ]

    setAssembledPrompt(lines.join('\n'))
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
            <div key={field.id} className="field">
              <label htmlFor={field.id}>{field.label}</label>
              {field.type === 'string' ? (
                <textarea
                  id={field.id}
                  value={values[field.id] as string}
                  onChange={(event) => updateStringField(field.id, event.target.value)}
                  rows={3}
                />
              ) : null}

              {field.type === 'string[]' ? (
                <div className="listField">
                  {(values[field.id] as string[]).map((item, index) => (
                    <div key={`${field.id}-${index}`} className="listRow">
                      <textarea
                        value={item}
                        onChange={(event) =>
                          updateListField(field.id, index, event.target.value)
                        }
                        rows={2}
                      />
                      <button
                        type="button"
                        className="dangerBtn"
                        onClick={() => removeListItem(field.id, index)}
                        disabled={(values[field.id] as string[]).length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="secondaryBtn"
                    onClick={() => addListItem(field.id)}
                  >
                    Add item
                  </button>
                </div>
              ) : null}

              {field.type === 'boolean' ? (
                <label className="switch" htmlFor={`${field.id}-toggle`}>
                  <input
                    id={`${field.id}-toggle`}
                    type="checkbox"
                    checked={values[field.id] as boolean}
                    onChange={(event) =>
                      updateBooleanField(field.id, event.target.checked)
                    }
                  />
                  <span className="slider" />
                </label>
              ) : null}
            </div>
          ))}

          <button type="submit" className="submitBtn">
            Assemble Prompt
          </button>
        </form>
      </section>

      <section className="output">
        <h2>Structured prompt output</h2>
        <textarea
          readOnly
          value={promptPreview}
          placeholder="Your assembled prompt will appear here after submitting the form."
          rows={16}
        />
      </section>
    </main>
  )
}

const formatList = (items: string[]) => {
  const cleanItems = items.map((item) => item.trim()).filter(Boolean)
  if (cleanItems.length === 0) return '(none)'
  return cleanItems.join(' | ')
}

export default App
