import React from 'react'

const DataList = props => {
  const { options = [], label, placeholder, id, errorMessage, value, onChange, ...restProps } = props

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
          className='form-control'
          list='datalistOptions'
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <datalist id='datalistOptions'>
          {options.map(option => (
            <option key={option.id} value={option.value} />
          ))}
        </datalist>
        <div className='invalid-feedback'>{errorMessage || ''}</div>
      </div>
    </>
  )
}

const areEqual = (prevProps, nextProps) => {
  return prevProps.value === nextProps.value
}

export default React.memo(DataList, areEqual)
