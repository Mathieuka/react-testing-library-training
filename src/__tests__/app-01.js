/* eslint-disable testing-library/prefer-screen-queries,testing-library/no-debug */
import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import App from '../app'
import {submitForm as mockSubmitForm} from '../api'

jest.mock('../api')

test('can fill out a form across multiple pages', async () => {
  mockSubmitForm.mockResolvedValueOnce({success: true})
  const testData = {food: 'test food', drink: 'test drink'}
  const {findByLabelText, findByText} = render(<App />)
  fireEvent.click(await findByText(/fill.*form/i))
  fireEvent.change(await findByLabelText(/food/i), {
    target: {value: testData.food},
  })
  fireEvent.click(await findByText(/next/i))
  fireEvent.change(await findByLabelText(/drink/i), {
    target: {value: testData.drink},
  })
  fireEvent.click(await findByText(/review/i))

  expect(await findByLabelText(/favorite food/i)).toHaveTextContent('test food')
  expect(await findByLabelText(/favorite drink/i)).toHaveTextContent(
    'test drink',
  )

  fireEvent.click(await findByText(/confirm/i, {selector: 'button'}))
  fireEvent.click(await findByText(/home/i))
  expect(mockSubmitForm).toHaveBeenCalledWith(testData)
  expect(mockSubmitForm).toHaveBeenCalledTimes(1)
  expect(await findByText(/welcome home/i)).toBeInTheDocument()
})
