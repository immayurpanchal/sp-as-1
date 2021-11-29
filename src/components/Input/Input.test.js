import { render } from '@testing-library/react'
import Input from '.'

// describe is used to define the test suite.
describe('Input component', () => {
  // for individual scenario testing, use it()
  // this way the test will written in a declarative way.
  // it will be easy to read and maintain
  it('render input component', () => {
    const tree = render(
      <Input
        key='bedroom'
        required
        errorMessage='Bedroom must be between 1 and 10'
        id='bedroom'
        label='Bedroom'
        max='10'
        min='1'
        type='number'
        validate={({ target: { value } }) => +value >= 1 && +value <= 10}
        value={0}
        onChange={() => {
          // Do nothing
        }}
      />
    )

    // Example of Snapshot Testing
    expect(tree).toMatchSnapshot()
  })
})
