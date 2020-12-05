import React from 'react'
import {render as rtlRender} from '@testing-library/react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import userEvent from '@testing-library/user-event'
import {reducer} from '../redux-reducer'
import {Counter} from '../redux-counter'

function render(
  ui,
  {initialState, store = createStore(reducer, initialState)} = {},
  ...rtlOptions
) {
  const Wrapper = ({children}) => <Provider store={store}>{children}</Provider>
  return {
    ...rtlRender(ui, {wrapper: Wrapper}, ...rtlOptions),
    store,
  }
}

test('can render with redux with default', () => {
  const {getByText, getByLabelText} = render(<Counter />)
  userEvent.click(getByText('+'), {})
  expect(getByLabelText(/count/i)).toHaveTextContent('1')
})

test('can render with custom initialState', () => {
  const initialState = {initialState: {count: '2'}}
  const {store, getByLabelText} = render(<Counter />, initialState)
  expect(getByLabelText(/count/i)).toHaveTextContent('2')
  expect(store.getState().count).toEqual('2')
})
