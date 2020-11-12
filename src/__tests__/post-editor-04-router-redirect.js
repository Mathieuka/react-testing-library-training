import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {Redirect as MockRedirect} from 'react-router'
import {Editor} from '../post-editor-04-router-redirect'
import {savePost as mockSavePost} from '../api'

jest.mock('../api')
jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

test('render a form with title, content, tags and a submit button and mock react router', async () => {
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

  await waitFor(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})
