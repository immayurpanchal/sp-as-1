import { useEffect, useReducer, useState } from 'react';
import './App.css';
import Input from './components/Input';

const initialState = {
	bedroom: 0,
	bathroom: 0,
	address: '',
	description: '',
};

const formReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'manual':
		case 'csv':
			return { ...state, [action.name]: action.value };
		default:
			return state;
	}
};

const App = () => {
	// TODO: .eslintrc .prettierrc
	const [isFormVisible, setFormVisibility] = useState(false);
	const [state, dispatch] = useReducer(formReducer, initialState);
	const [csvData, setCsvData] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(state);

		e.target.classList.add('was-validated');
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		dispatch({ id, value });
	};

	const renderForm = () => {
		return (
			<form
				onSubmit={handleSubmit}
				onChange={handleChange}
				className='mt-3 needs-validation'
				noValidate
			>
				<div className='mb-3'>
					<Input
						required
						key='address'
						defaultValue={state.address}
						type='text'
						className='form-control'
						id='address'
						label='Address'
						value={state.address}
						validate={({ target: { value } }) => value.trim().length > 0}
						onChange={(e) =>
							dispatch({
								type: 'manual',
								name: e.target.name,
								value: e.target.value,
							})
						}
						// pattern='[A-Z ]+'
						errorMessage='Address must be a valid address'
					/>
				</div>
				<div className='mb-3'>
					<Input
						required
						key='bedroom'
						defaultValue={state.bedroom}
						type='number'
						label='Bedroom'
						id='bedroom'
						value={state.bedroom}
						onChange={(e) =>
							dispatch({
								type: 'manual',
								name: e.target.name,
								value: +e.target.value,
							})
						}
						validate={({ target: { value } }) => +value >= 5 && +value <= 10}
						errorMessage='Bedroom must be between 5 and 10'
					/>
				</div>
				<div className='mb-3'>
					<Input
						required
						key='bathroom'
						defaultValue={state.bathroom}
						type='number'
						id='bathroom'
						label='Bathroom'
						value={state.bathroom}
						validate={({ target: { value } }) => +value >= 1 && +value <= 5}
						onChange={(e) =>
							dispatch({
								type: 'manual',
								name: e.target.name,
								value: +e.target.value,
							})
						}
						errorMessage='Bathroom must be between 1 and 5'
					/>
				</div>
				<div className='mb-3'>
					<Input
						type='text'
						key='description'
						defaultValue={state.description}
						className='form-control'
						id='description'
						label='Description'
						value={state.description}
						validate={() => true}
						onChange={(e) =>
							dispatch({
								type: 'manual',
								name: e.target.name,
								value: e.target.value,
							})
						}
					/>
				</div>
				<button className={`btn btn-primary`} type='submit'>
					Submit
				</button>
			</form>
		);
	};

	const readFile = (file) => {
		try {
			if (file.type !== 'text/csv') throw new Error('File must be a CSV file');
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result.split('\n')[0];
				const [address, bedroom, bathroom, description] = result.split(';');
				setCsvData({ address, bedroom, bathroom, description });
				console.log({ address, bedroom, bathroom, description });
				setFormVisibility(true);
			};
			reader.readAsText(file);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!isFormVisible || !csvData) return;

		dispatch({ type: 'csv', name: 'address', value: csvData.address });
		dispatch({ type: 'csv', name: 'bedroom', value: +csvData.bedroom });
		dispatch({ type: 'csv', name: 'bathroom', value: +csvData.bathroom });
		dispatch({ type: 'csv', name: 'description', value: csvData.description });
	}, [csvData, isFormVisible]);

	return (
		<div className='App container-sm'>
			<div className='d-flex flex-column'>
				<button
					className='btn btn-primary'
					onClick={() => setFormVisibility((prevState) => !prevState)}
					type='button'
				>
					Add Manually
				</button>
				<span>OR</span>
				<label htmlFor='formFileSm' className='form-label'>
					Upload CSV
				</label>
				<Input
					className='form-control'
					type='file'
					id='formFile'
					accept='.csv'
					onChange={(e) => {
						readFile(e.target.files[0]);
					}}
					validate={(e) => e.target.files[0]?.type === 'text/csv'}
					errorMessage='File must be a CSV file'
				/>
				{isFormVisible && renderForm()}
			</div>
		</div>
	);
};

export default App;
