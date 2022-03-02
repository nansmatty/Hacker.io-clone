import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../helpers/alert';
import { API } from '../config';
import { authenticate, isAuthenticated } from '../helpers/auth';

const Login = () => {
	const [stateValues, setStateValues] = useState({
		email: '',
		password: '',
		error: '',
		success: '',
	});

	const { email, password, error, success } = stateValues;

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
			const { data } = await axios.post(`${API}/login`, {
				email,
				password,
			});
			authenticate(data, () => {
				isAuthenticated() && isAuthenticated().role === 'admin'
					? Router.push('/admin')
					: Router.push('/user');
			});
		} catch (error) {
			setStateValues({ ...stateValues, error: error.response.data.error });
		}
	};
	const loginForm = () => (
		<form onSubmit={submitHandler}>
			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Email</label>
					<input
						type='email'
						value={email}
						className='form-control'
						placeholder='Email Address'
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
						placeholder='Password'
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
			<div className='form-group'>
				<Link href='/auth/password/forgot'>
					<a className='text-dark fw-bold'>Forgot Password</a>
				</Link>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className='col-md-6 offset-md-3 shadow p-3 rounded'>
				<h3 style={{ letterSpacing: '1px', fontWeight: '600' }}>Login</h3>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{loginForm()}
			</div>
		</Layout>
	);
};

export default Login;
