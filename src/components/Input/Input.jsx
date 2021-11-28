import React from 'react'

const Input = props => {
  const { label, value, id, validate, errorMessage, ...restProps } = props

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
          name={id}
          value={value || ''}
          className='form-control'
          onInput={e => {
            if (typeof props.validate !== 'function') return

            const isValidVal = !!props.validate(e)
            if (!isValidVal) {
              e.currentTarget.setCustomValidity(errorMessage)
            } else {
              e.currentTarget.setCustomValidity('')
            }
          }}
        />
        <div className='invalid-feedback'>{errorMessage || ''}</div>
      </div>
    </>
  )
}

export default Input
