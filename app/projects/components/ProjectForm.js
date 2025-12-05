// TODO: Students will implement this component
// This is a learning exercise - students should build this form component from scratch
// The tests will guide the implementation requirements

// Component Requirements:
// 1. Create a form component that accepts { onSubmit, onCancel, isOpen } props
// 2. Manage form state for: title, description, imageUrl, projectUrl, githubUrl, technologies
// 3. Implement form validation:
//    - title: required
//    - description: required
//    - technologies: required (at least one)
//    - URLs: validate format if provided
// 4. Handle form submission and loading states
// 5. Display validation errors to user
// 6. Reset form after successful submission
// 7. Only render when isOpen is true
// 8. Include TechnologyInput component for managing technologies

// Learning Objectives:
// - React state management with useState
// - Form validation patterns
// - Conditional rendering
// - Event handling
// - Error state management
// - Component composition

// Hints:
// - Use 'use client' directive for client-side functionality
// - Import TechnologyInput from './TechnologyInput'
// - Use regex for URL validation: /^https?:\/\/.+\..+/
// - Handle async form submission with try/catch
// - Use loading state to prevent double submission

import React, { useState, useEffect } from 'react'
import TechnologyInput from './TechnologyInput'

export default function ProjectForm({ onSubmit = () => {}, onCancel = () => {}, isOpen = false }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [technologies, setTechnologies] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // reset when closed
      setTitle('')
      setDescription('')
      setImageUrl('')
      setProjectUrl('')
      setGithubUrl('')
      setTechnologies([])
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

  function validate() {
    const next = {}
    if (!title.trim()) next.title = 'Title is required'
    if (!description.trim()) next.description = 'Description is required'
    if (!Array.isArray(technologies) || technologies.length === 0) next.technologies = 'At least one technology is required'

    const urlRegex = /^https?:\/\/.+\..+/
    if (imageUrl && !urlRegex.test(imageUrl)) next.imageUrl = 'Please enter a valid URL'
    if (projectUrl && !urlRegex.test(projectUrl)) next.projectUrl = 'Please enter a valid URL'
    if (githubUrl && !urlRegex.test(githubUrl)) next.githubUrl = 'Please enter a valid URL'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl || '',
        projectUrl: projectUrl || '',
        githubUrl: githubUrl || '',
        technologies
      })

      // keep form open or reset depending on consumer; tests expect reset after success
      setTitle('')
      setDescription('')
      setImageUrl('')
      setProjectUrl('')
      setGithubUrl('')
      setTechnologies([])
      setErrors({})
    } catch (err) {
      // swallow, but log
      // consumer tests will mock onSubmit; preserve behavior
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Project</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Project Title</label>
        <input
          aria-label="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.title && <p className="text-red-600 mt-1">{errors.title}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          aria-label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-600 mt-1">{errors.description}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Technologies</label>
        <TechnologyInput
          technologies={technologies}
          onChange={(next) => setTechnologies(next)}
          error={errors.technologies}
        />
        {errors.technologies && <p className="text-red-600 mt-1">{errors.technologies}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Image URL</label>
        <input
          aria-label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.imageUrl && <p className="text-red-600 mt-1">{errors.imageUrl}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Live Demo URL</label>
        <input
          aria-label="Live Demo URL"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${errors.projectUrl ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.projectUrl && <p className="text-red-600 mt-1">{errors.projectUrl}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">GitHub URL</label>
        <input
          aria-label="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${errors.githubUrl ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.githubUrl && <p className="text-red-600 mt-1">{errors.githubUrl}</p>}
      </div>

      <div className="flex gap-3 items-center">
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isSubmitting ? 'Creating Project...' : 'Create Project'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
          Cancel
        </button>
      </div>
    </form>
  )
}