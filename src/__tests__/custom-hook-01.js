import {renderHook, act} from '@testing-library/react-hooks'
import {useCounter} from '../use-counter'

test('expose the count and increment/decrement functions', () => {
  const {result} = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('expose the count, set step to 2 and increment/decrement', () => {
  const {result} = renderHook(useCounter, {
    initialProps: {initialCount: 0, step: 2},
  })
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})
