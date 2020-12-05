import React from 'react'
import {render, act} from '@testing-library/react'
import {useCounter} from '../use-counter'

test('should increment/decrement useCounter Hook', () => {
  let result
  function TestComponent() {
    result = useCounter({initialCount: 0, step: 1})
    return null
  }
  render(<TestComponent />)
  expect(result.count).toBe(0)
  act(() => result.increment())
  expect(result.count).toBe(1)
  act(() => result.decrement())
  expect(result.count).toBe(0)
})
