import TextField from './TextField'

type ListFieldProps = {
  fieldId: string
  items: string[]
  onItemChange: (index: number, nextValue: string) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
}

function ListField({
  fieldId,
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: ListFieldProps) {
  return (
    <div className="listField">
      {items.map((item, index) => (
        <div key={`${fieldId}-${index}`} className="listRow">
          <TextField
            id={`${fieldId}-${index}`}
            value={item}
            rows={2}
            onChange={(nextValue) => onItemChange(index, nextValue)}
          />
          <button
            type="button"
            className="dangerBtn"
            onClick={() => onRemoveItem(index)}
            disabled={items.length === 1}
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" className="secondaryBtn" onClick={onAddItem}>
        Add item
      </button>
    </div>
  )
}

export default ListField
