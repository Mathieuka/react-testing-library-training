/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {Redirect as MockRedirect} from 'react-router'
import {build, fake, sequence} from 'test-data-bot'
import {Editor} from '../post-editor-08-custom-render'
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

const userBuilder = build('User').fields({
    id: sequence((s) => `user-${s}`),
})

const postBuilder = build('Post').fields({
    title: fake((f) => f.lorem.words()),
    content: fake((f) => f.lorem.paragraphs().replace(/\s/g, '')),
    tags: fake((f) => [f.lorem.words(), f.lorem.words(), f.lorem.words()]),
})

function renderEditor() {
    const fakeUser = userBuilder()
    const utils = render(<Editor user={fakeUser} />)
    const fakePost = postBuilder({content: 'example is something special, so i can custom it'})
    utils.getByLabelText(/title/i).value = fakePost.title
    utils.getByLabelText(/content/i).value = fakePost.content
    utils.getByLabelText(/tags/i).value = fakePost.tags.join(',')
    const submitButton = utils.getByText(/submit/i)

    return {
        ...utils,
        fakePost,
        fakeUser,
        submitButton,
    }
}

test('render a form with title, content, tags and a submit button and mock react router', async () => {
    mockSavePost.mockResolvedValueOnce()
    const {submitButton, fakeUser, fakePost} = renderEditor()
    const preDate = new Date().getTime()

    fireEvent.click(submitButton)
    expect(submitButton).toBeDisabled()

    expect(mockSavePost).toHaveBeenCalledWith({
        ...fakePost,
        date: expect.any(String),
        authorId: fakeUser.id,
    })
    expect(mockSavePost).toHaveBeenCalledTimes(1)
    const postDate = new Date().getTime()

    const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
    expect(date).toBeGreaterThanOrEqual(preDate)
    expect(date).toBeLessThanOrEqual(postDate)

    await waitFor(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})

test('renders an error message from the server', async () => {
    const testError = "test error";
    mockSavePost.mockRejectedValueOnce({data: {error: testError}})
    const {submitButton, findByRole, } = renderEditor()
    fireEvent.click(submitButton)

    const postError = await findByRole(/alert/i)
    expect(postError).toHaveTextContent(testError)
    expect(submitButton).toBeEnabled()
})