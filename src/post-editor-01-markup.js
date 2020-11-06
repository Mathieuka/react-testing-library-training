import React, {useState} from 'react'
import {savePost} from './api'

const Editor = ({user}) => {
  const [isSave, setIsSaving] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const {title, content, tags} = e.target.elements
    setIsSaving(true)
    const newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((cv) => cv.trim()),
      authorId: user.id,
    }
    savePost(newPost)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" name="title" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" name="content" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" name="tags" />

      <button disabled={isSave} type="submit">
        Submit
      </button>
    </form>
  )
}

export {Editor}
