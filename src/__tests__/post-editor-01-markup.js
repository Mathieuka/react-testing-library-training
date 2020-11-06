import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {Editor} from '../post-editor-01-markup'
import {savePost as mockSavePost} from '../api'

jest.mock('../api')

afterEach(() => {
    jest.clearAllMocks()
})

test('render a form with title, content, tags and a submit button', () => {
  mockSavePost.mockResolvedValueOnce()
  const fakeUser = {id: 1234}
  const {getByText, getByLabelText} = render(<Editor user={fakeUser} />)

  const fakePost = {
    title: 'Test Title',
    content: 'Test Content',
    tags: ['Tag1', 'Tag2'],
    authorId: 1234,
  }

  getByLabelText(/title/i).value = fakePost.title
  getByLabelText(/content/i).value = fakePost.content
  getByLabelText(/tags/i).value = fakePost.tags.join(',')

  const submitButton = getByText(/submit/i)
  fireEvent.click(submitButton)
  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    authorId: fakeUser.id,
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)
})
