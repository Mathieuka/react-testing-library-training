import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {GreetingLoader} from '../greeting-loader-01-mocking'
import {loadGreeting as mockLoadGreeting} from '../api'

jest.mock('../api')

test('loads greeting on click', async () => {
  const testGreeting = 'matt'
  // mock resolved response of the api
  mockLoadGreeting.mockResolvedValue({data: {greeting: testGreeting}})

  const {getByLabelText, getByText} = render(
    <GreetingLoader />,
  )
  const nameInput = getByLabelText(/name/i)
  const loadButton = getByText(/load greeting/i)
  nameInput.value = testGreeting

  fireEvent.click(loadButton)
  expect(mockLoadGreeting).toHaveBeenCalledWith(testGreeting)
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)

  // verify if the ui is update for ensure the test is working
  await waitFor(() => {
    expect(getByLabelText(/greeting/i)).toHaveTextContent(testGreeting)
  })
})
