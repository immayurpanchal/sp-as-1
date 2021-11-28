import React from 'react'

const DataList = props => {
  const {
    options = [],
    label,
    placeholder,
    onSelect,
    id,
    errorMessage,
    onInitialValueChange,
    reference,
    ...restProps
  } = props
  const ref = React.useRef(null)
  const inputRef = React.useRef(null)

  const handleChange = e => {
    const currentTypedValue = e.target.value || ''
    for (const option of ref.current.children) {
      const value = option.value
      if (value.toLowerCase() === currentTypedValue.toLowerCase()) {
        props.onSelect(value)
      }
    }
  }

  return (
    <>
      {label && (
        <label htmlFor={id} className='col-sm-2 col-form-label'>
          {label}
        </label>
      )}
      <div className='col-sm-10'>
        <input
          {...restProps}
          className='form-control'
          list='datalistOptions'
          name={id}
          placeholder={placeholder}
          onChange={handleChange}
          ref={localRef => {
            inputRef.current = localRef
            props.reference(inputRef)
          }}
          required
        />
        <datalist id='datalistOptions' ref={ref}>
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
