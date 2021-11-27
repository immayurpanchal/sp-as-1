import React, { useState } from 'react';

const Input = (props) => {
	const { label, id, value, validate, errorMessage, ...restProps } = props;

	const [isValid, setValid] = useState(false);
	const [isTouched, setTouched] = useState(false);

	const getStyle = () => {
		if (isTouched) {
			return isValid ? 'is-valid' : 'is-invalid';
		}
		return '';
	};

	return (
		<>
			{label && (
				<label htmlFor={id} className='form-label'>
					{label}
				</label>
			)}
			<input
				{...restProps}
				name={id}
				className={`form-control ${getStyle()}`}
				onFocus={(e) => {
					typeof validate === 'function' && setValid(props.validate(e));
					setTouched(true);
				}}
				onChange={(e) => {
					typeof validate === 'function' && setValid(props.validate(e));
					props.onChange(e);
				}}
				onBlur={(e) => {
					typeof validate === 'function' && setValid(props.validate(e));
					setTouched(true);
				}}
			/>
			<div className='invalid-feedback'>{errorMessage || ''}</div>
		</>
	);
};

export default Input;
