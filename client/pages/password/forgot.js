import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Router from 'next/router';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../helpers/alert';
import { API } from '../../config';
import { isAuthenticated } from '../../helpers/auth';
const ForgotPassword = () => {
	const [state, setState] = useState({
		email: '',
		success: '',
		error: '',
	});

	const { email, success, error } = state;

	useEffect(() => {
		isAuthenticated() && Router.push('/');
	}, []);

	const handleChange = (e) => {
		setState({
			...state,
			email: e.target.value,
			success: '',
			error: '',
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put(`${API}/password/forgot`, {
				email,
			});
			setState({
				...state,
				email: '',
				success: response.data.message,
			});
		} catch (error) {
			setState({ ...state, error: error.response.data.error });
		}
	};

	const forgotPasswordForm = () => (
		<form onSubmit={submitHandler}>
			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Email</label>
					<input
						type='email'
						className='form-control'
						placeholder='Email Address'
						onChange={handleChange}
						value={email}
						autoComplete='true'
						required
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
				<h3 style={{ letterSpacing: '1px', fontWeight: '600' }}>
					Forgot Password
				</h3>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{forgotPasswordForm()}
			</div>
		</Layout>
	);
};

export default ForgotPassword;
