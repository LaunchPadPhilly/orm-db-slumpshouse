import { useState, useRef, useEffect } from 'react'

export default function TechnologyInput({ technologies = [], onChange, error }) {
  const [input, setInput] = useState('')

  const quickAdd = ['JavaScript', 'React', 'Next.js']
  const inputRef = useRef(null)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return

    function onKeyPressDom(e) {
      const isEnter = e.key === 'Enter' || e.which === 13 || e.keyCode === 13 || e.charCode === 13
      if (isEnter) {
        e.preventDefault()
        const val = el.value || ''
        addTechnology(val)
      }
    }

    el.addEventListener('keypress', onKeyPressDom)
    return () => el.removeEventListener('keypress', onKeyPressDom)
  }, [inputRef, technologies])

  function addTechnology(value) {
    const tech = String(value).trim()
    if (!tech) return
    // Prevent duplicates
    if (technologies.includes(tech)) return
    onChange([...technologies, tech])
    setInput('')
  }

  function handleAddClick() {
    addTechnology(input)
  }

  function handleKeyPress(e) {
    const isEnter = e.key === 'Enter' || e.which === 13 || e.keyCode === 13 || e.charCode === 13
    if (isEnter) {
      e.preventDefault()
      const valueFromEvent = e?.target?.value
      const valueToAdd = (typeof input === 'string' && input.trim()) ? input : (typeof valueFromEvent === 'string' ? valueFromEvent : '')
      addTechnology(valueToAdd)
    }
  }

  function handleQuickAdd(tech) {
    addTechnology(tech)
  }

  function removeTech(index) {
    const next = technologies.filter((_, i) => i !== index)
    onChange(next)
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          placeholder="Type a technology"
          aria-label="Technology input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
          onKeyDown={handleKeyPress}
          onKeyPress={handleKeyPress}
          onKeyUp={handleKeyPress}
          className={`border px-3 py-2 rounded w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        <button type="button" onClick={handleAddClick} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {quickAdd.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleQuickAdd(q)}
            disabled={technologies.includes(q)}
            aria-label={q}
            className={`px-3 py-1 rounded border ${technologies.includes(q) ? 'bg-gray-200 text-gray-500' : 'bg-white'}`}
          >
            {technologies.includes(q) ? '' : q}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {technologies.map((t, i) => (
          <div key={t + i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded flex items-center gap-2">
            <span>{t}</span>
            <button aria-label={`Remove ${t}`} type="button" onClick={() => removeTech(i)} className="text-sm">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}