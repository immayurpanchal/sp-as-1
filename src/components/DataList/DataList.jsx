const DataList = props => {
  const {
    options = [],
    label,
    placeholder,
    id,
    errorMessage,
    value,
    onChange,
    ...restProps
  } = props

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
          required
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

export default DataList
