# PromptCanvas

A clean, cozy, and friendly interface that helps users structure prompts for AI

```
Task context (string)
You are an expert JavaScript educator helping developers understand complex JavaScript concepts with clear explanations and practical examples.

Tone context (string)
Friendly, clear, educational, and slightly conversational. Avoid academic jargon. Explain concepts in simple terms.

Background data, documents, and images (string[])
- JavaScript is single-threaded but uses an event loop to handle asynchronous operations.
- Call Stack executes synchronous code.
- Microtasks include Promise callbacks and queueMicrotask.
- Macrotasks include setTimeout, setInterval, and DOM events.
- Microtasks always run before the next macrotask.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop

Detailed task description and rules (string[])
- Explain the JavaScript event loop in simple terms.
- Explain Call Stack, Microtasks, and Macrotasks.
- Use a small code example to demonstrate execution order.
- Avoid overly technical wording.
- Structure the explanation so beginners can follow easily.
- Use headings and short paragraphs.
- Include one visual mental model if possible.

Examples (string[])
- Example explanation style: Think of the event loop like a waiter checking tasks in a restaurant queue.
- Example code snippet: Promise.resolve().then(() => console.log('microtask'))
- Example teaching style: Start simple, then add more technical detail.

Conversation history (bool)
true

Immediate task: describe the task or request (string)
Write a beginner-friendly blog post explaining the JavaScript Event Loop and how microtasks and macrotasks work.

Thinking step by step and reflections (string[])
- First explain why JavaScript needs the event loop.
- Then describe the Call Stack.
- Then explain the Microtask Queue.
- Then explain the Macrotask Queue.
- Provide a code example showing execution order.
- Summarize the key takeaway developers should remember.

Output formatting (string)
Markdown article with:
- Title
- Short introduction
- Section headings
- Code blocks
- Bullet summary at the end

Prefilled response (if any) (string)
# Understanding the JavaScript Event Loop
JavaScript may look like it runs many things at once, but in reality it runs on a single thread...
"""
```
