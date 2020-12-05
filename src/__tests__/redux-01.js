import React from 'react'
import {render, screen} from '@testing-library/react'
import {Provider} from 'react-redux'
import userEvent from '@testing-library/user-event'
import {store} from '../redux-store'
import {Counter} from '../redux-counter'

test('can render with redux with default', () => {
  render(
    <Provider store={store}>
      <Counter />
    </Provider>,
  )
  userEvent.click(screen.getByText('+'), {})
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('1')
})
