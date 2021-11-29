import { useRef } from 'react'

const DataList = props => {
  const {
    options = [],
    label,
    placeholder,
    onSelect,
    id,
    errorMessage,
    reference,
    ...restProps
  } = props
  const ref = useRef(null)
  const inputRef = useRef(null)

  const handleChange = e => {
    const currentTypedValue = e.target.value || ''
    for (const option of ref.current.children) {
      const value = option.value
      if (value.toLowerCase() === currentTypedValue.toLowerCase()) {
        onSelect(value)
      }
    }
  }

  return (
    <>
      {label && (
        <label className='col-sm-2 col-form-label' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='col-sm-10'>
        <input
          {...restProps}
          ref={localRef => {
            inputRef.current = localRef
            reference(inputRef)
          }}
          required
          className='form-control'
          list='datalistOptions'
          name={id}
          placeholder={placeholder}
          onChange={handleChange}
        />
        <datalist ref={ref} id='datalistOptions'>
          {options.map(option => (
            <option key={option.id} value={option.value} />
          ))}
        </datalist>
        <div className='invalid-feedback'>{errorMessage || ''}</div>
      </div>
    </>
  )
}

export default DataList
