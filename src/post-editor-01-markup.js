import React, {useState} from 'react'

function Editor() {
  const [isSave, setIsSave] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSave(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" />

      <button disabled={isSave} type="submit">
        Submit
      </button>
    </form>
  )
}

export {Editor}
