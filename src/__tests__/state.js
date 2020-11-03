import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import user from '@testing-library/user-event'
import {FavoriteNumber} from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  const {getByLabelText, getByRole, queryByRole, rerender, debug} = render(
    <FavoriteNumber />,
  )
  const input = getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  
  // we re-render and updating the props of the component 
  rerender(<FavoriteNumber max={10} />)

  // If `role` is not founded `queryByRole` return null but `getByRole` throw an Error
  // so verify if an element is not render use `queryByRole` instead of `getByRole`
  expect(queryByRole('alert')).toBeNull()

})
