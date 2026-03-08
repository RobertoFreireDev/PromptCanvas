import type { FieldConfig } from '../types/promptCanvas'
import ListField from './ListField'
import TextField from './TextField'
import ToggleField from './ToggleField'

type FormFieldProps = {
  field: FieldConfig
  value: string | string[] | boolean
  onStringChange: (fieldId: string, nextValue: string) => void
  onBooleanChange: (fieldId: string, nextValue: boolean) => void
  onListItemChange: (fieldId: string, index: number, nextValue: string) => void
  onListItemAdd: (fieldId: string) => void
  onListItemRemove: (fieldId: string, index: number) => void
}

function FormField({
  field,
  value,
  onStringChange,
  onBooleanChange,
  onListItemChange,
  onListItemAdd,
  onListItemRemove,
}: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={field.id}>{field.label}</label>

      {field.type === 'string' ? (
        <TextField
          id={field.id}
          value={value as string}
          onChange={(nextValue) => onStringChange(field.id, nextValue)}
        />
      ) : null}

      {field.type === 'string[]' ? (
        <ListField
          fieldId={field.id}
          items={value as string[]}
          onItemChange={(index, nextValue) =>
            onListItemChange(field.id, index, nextValue)
          }
          onAddItem={() => onListItemAdd(field.id)}
          onRemoveItem={(index) => onListItemRemove(field.id, index)}
        />
      ) : null}

      {field.type === 'boolean' ? (
        <ToggleField
          id={field.id}
          checked={value as boolean}
          onChange={(nextValue) => onBooleanChange(field.id, nextValue)}
        />
      ) : null}
    </div>
  )
}

export default FormField
