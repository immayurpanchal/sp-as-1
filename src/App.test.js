import { render } from '@testing-library/react'
import App from './App'

test('Render App component', () => {
  const tree = render(<App />)
  expect(tree).toMatchSnapshot()
})
