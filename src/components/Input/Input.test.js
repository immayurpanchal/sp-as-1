import { render } from '@testing-library/react'
import Input from '.'

// describe is used to define the test suite.
describe('Input component', () => {
  // for individual scenario testing, use it()
  // this way the test will written in a declarative way and will be easy to read and maintain
  it('render input component', () => {
    const tree = render(
      <Input
        required
        key='bedroom'
        min='1'
        max='10'
        type='number'
        label='Bedroom'
        id='bedroom'
        value={0}
        onChange={e =>
          dispatch({
            type: 'manual',
            name: e.target.name,
            value: +e.target.value
          })
        }
        validate={({ target: { value } }) => +value >= 1 && +value <= 10}
        errorMessage='Bedroom must be between 1 and 10'
      />
    )

    // Example of Snapshot Testing
    expect(tree).toMatchSnapshot()
  })
})
