/* eslint-disable testing-library/prefer-screen-queries,testing-library/no-debug */
import React from 'react'
import {render} from '@testing-library/react'
import user from '@testing-library/user-event'
import App from '../app'
import {submitForm as mockSubmitForm} from '../api'

jest.mock('../api')

test('can fill out a form across multiple pages', async () => {
  mockSubmitForm.mockResolvedValueOnce({success: true})
  const testData = {food: 'test food', drink: 'test drink'}
  const {findByLabelText, findByText} = render(<App />)
  user.click(await findByText(/fill.*form/i))
  user.type(await findByLabelText(/food/i), testData.food)
  user.click(await findByText(/next/i))
  user.type(await findByLabelText(/drink/i), testData.drink)
  user.click(await findByText(/review/i))

  expect(await findByLabelText(/favorite food/i)).toHaveTextContent('test food')
  expect(await findByLabelText(/favorite drink/i)).toHaveTextContent(
    'test drink',
  )

  user.click(await findByText(/confirm/i, {selector: 'button'}))
  user.click(await findByText(/home/i))
  expect(mockSubmitForm).toHaveBeenCalledWith(testData)
  expect(mockSubmitForm).toHaveBeenCalledTimes(1)
  expect(await findByText(/welcome home/i)).toBeInTheDocument()
})
