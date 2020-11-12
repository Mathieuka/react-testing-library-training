import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {Redirect as MockRedirect} from 'react-router'
import {Editor} from '../post-editor-05-dates'
import {savePost as mockSavePost} from '../api'

/* 
    the technic here is to get the timestamp before the function is call `preDate` and 
    after the function is called `postDate`, after that we get the arguments `date` in the 
    calls object (calls object is the argument of the original function) and ensure 
    that `preDate` is lesser or equal of `date` and `postDate`is greater or equal of `date`
*/

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
  const preDate = new Date().getTime() // <== preDate

  getByLabelText(/title/i).value = fakePost.title
  getByLabelText(/content/i).value = fakePost.content
  getByLabelText(/tags/i).value = fakePost.tags.join(',')

  const submitButton = getByText(/submit/i)
  fireEvent.click(submitButton)
  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    // date: expect.any(String),
    date: expect.any(String),
    authorId: fakeUser.id,
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  const postDate = new Date().getTime() // <== postDate

  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  await waitFor(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})
