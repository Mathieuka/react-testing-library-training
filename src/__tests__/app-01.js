/* eslint-disable testing-library/prefer-screen-queries,testing-library/no-debug */
import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import App from '../app'
import {submitForm as mockSubmitForm} from '../api'

jest.mock('../api')

test('can fill out a form across multiple pages', async () => {
  mockSubmitForm.mockResolvedValueOnce({success: true})
  const testData = {food: 'test food', drink: 'test drink'}
  const {getByLabelText, getByText, findByText} = render(<App />)
  fireEvent.click(getByText(/fill.*form/i))
  fireEvent.change(getByLabelText(/food/i), {target: {value: testData.food}})
  fireEvent.click(getByText(/next/i))
  fireEvent.change(getByLabelText(/drink/i), {target: {value: testData.drink}})
  fireEvent.click(getByText(/review/i))

  expect(getByLabelText(/favorite food/i)).toHaveTextContent('test food')
  expect(getByLabelText(/favorite drink/i)).toHaveTextContent('test drink')

  fireEvent.click(getByText(/confirm/i, {selector: 'button'}))
  fireEvent.click(await findByText(/home/i))
  expect(mockSubmitForm).toHaveBeenCalledWith(testData)
  expect(mockSubmitForm).toHaveBeenCalledTimes(1)
  expect(getByText(/welcome home/i)).toBeInTheDocument()
})
