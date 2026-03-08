import type { FieldConfig, FormValues } from '../types/promptCanvas'

export const fields: FieldConfig[] = [
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

export const createInitialValues = (): FormValues => {
  const values: FormValues = {}

  for (const field of fields) {
    if (field.type === 'string') values[field.id] = ''
    if (field.type === 'string[]') values[field.id] = ['']
    if (field.type === 'boolean') values[field.id] = false
  }

  return values
}
