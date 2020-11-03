import 'jest-axe/extend-expect'
import React from 'react'
import {render} from '@testing-library/react'
import {axe,} from 'jest-axe'


function Form() {
  return (
    <form>
      <label htmlFor="email">email</label>
      <input type="email" placeholder="email" name="email" id="email" />
    </form>
  )
}

test('the form is accessible', async () => {
  const {container, debug} = render(<Form />)
  const result = await axe(container)
  expect(result).toHaveNoViolations()
})
