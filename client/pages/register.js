import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../helpers/alert';
import { API } from '../config';
import { isAuthenticated } from '../helpers/auth';

const Register = () => {
	const [stateValues, setStateValues] = useState({
		name: '',
		email: '',
		password: '',
		error: '',
		success: '',
	});

	const { name, email, password, error, success } = stateValues;

	useEffect(() => {
		isAuthenticated() && Router.push('/');
	}, []);

	const handleChange = (name) => (e) => {
		setStateValues({
			...stateValues,
			[name]: e.target.value,
			error: '',
			success: '',
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API}/register`, {
				name,
				email,
				password,
			});

			setStateValues({
				...stateValues,
				name: '',
				email: '',
				password: '',
				success: response.data.message,
			});
		} catch (error) {
			setStateValues({ ...stateValues, error: error.response.data.error });
		}
	};
	const registerForm = () => (
		<form onSubmit={submitHandler}>
			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Name</label>
					<input
						type='text'
						value={name}
						className='form-control'
						onChange={handleChange('name')}
						autoComplete='true'
					/>
				</div>
			</div>
			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Email</label>
					<input
						type='email'
						value={email}
						className='form-control'
						onChange={handleChange('email')}
						autoComplete='true'
					/>
				</div>
			</div>
			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Password</label>
					<input
						type='password'
						value={password}
						className='form-control'
						onChange={handleChange('password')}
						autoComplete='true'
					/>
				</div>
			</div>
			<div className='form-group'>
				<div className='mb-3'>
					<button className='btn btn-outline-success fw-bold'>Submit</button>
				</div>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className='col-md-6 offset-md-3 shadow p-3 rounded'>
				<h3 style={{ letterSpacing: '1px', fontWeight: '600' }}>Register</h3>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{registerForm()}
			</div>
		</Layout>
	);
};

export default Register;
