import React from 'react'

const Input = props => {
  const { label, value, id, validate, errorMessage, ...restProps } = props
  // eslint-disable-next-line no-console
  console.log({ label, value })
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
          name={id}
          value={value || ''}
          onInput={e => {
            if (typeof validate !== 'function') {
              return
            }

            const isValidVal = !!validate(e)
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

const areEqual = (prevProps, nextProps) => {
  return prevProps.value === nextProps.value
}

export default React.memo(Input, areEqual)
