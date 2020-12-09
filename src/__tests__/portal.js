import React from 'react'
import {render, within} from '@testing-library/react'
import {Modal} from '../modal'

test('modal show the children', () => {
  const children = <div data-testid="test" />
  render(<Modal>{children}</Modal>)
  const {getByTestId} = within(document.getElementById('modal-root'))
  expect(getByTestId(/test/i)).toBeInTheDocument()
})
