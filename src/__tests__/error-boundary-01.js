import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {reportError as mockReportError} from '../api'
import {ErrorBoundary} from '../error-boundary'

jest.mock('../api')

beforeAll(() => {
  // for console.error silent
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
})

function Bomb({shouldThrow}) {
  if (shouldThrow) {
    throw new Error('BOoM')
  }
  return null
}

test('call reportError and render that there was a problem', async () => {
  // mock the Promise returned by mockReportError
  mockReportError.mockResolvedValueOnce({success: true})

  const {rerender, getByText, queryByText, getByRole, queryByRole} = await render(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>,
  )

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledTimes(2)
  expect(getByRole(/alert/i).textContent).toMatchInlineSnapshot(
    `"There was a problem."`,
  )

  /* /!\ clear the mocks before doing other test on it */
  console.error.mockClear()
  mockReportError.mockClear()

  await rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  fireEvent.click(getByText(/try again/i))
  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(queryByRole(/alert/i)).not.toBeInTheDocument()
  expect(queryByText(/try again/i)).not.toBeInTheDocument()
})
