type PromptOutputProps = {
  value: string
}

function PromptOutput({ value }: PromptOutputProps) {
  return (
    <section className="output">
      <h2>Structured prompt output</h2>
      <textarea
        readOnly
        value={value}
        placeholder="Your assembled prompt will appear here after submitting the form."
        rows={16}
      />
    </section>
  )
}

export default PromptOutput
