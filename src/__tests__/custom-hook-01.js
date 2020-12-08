import React from 'react'
import {render, act} from '@testing-library/react'
import {useCounter} from '../use-counter'

function setup({initialProps} = {}) {
  const result = {current: null}
  function TestComponent(props) {
    result.current = useCounter(props)
    return null
  }
  render(<TestComponent {...initialProps} />)
  return result
}

test('expose the count and increment/decrement functions', () => {
  const result = setup()
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('expose the count, set step to 2 and increment/decrement', () => {
  const result = setup({initialProps: {initialCount: 0, step: 2}})
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})
