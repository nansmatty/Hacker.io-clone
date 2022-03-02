import { useEffect, useState } from 'react';
import axios from 'axios';
import Router, { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';
import { API } from '../../../../config';
import {
	showErrorMessage,
	showSuccessMessage,
} from '../../../../helpers/alert';
import { isAuthenticated } from '../../../../helpers/auth';

const ResetPassword = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		resetPasswordLink: '',
		newPassword: '',
		success: '',
		error: '',
	});

	const { name, resetPasswordLink, newPassword, success, error } = state;

	useEffect(() => {
		let token = router.query.resetPasswordLink;

		if (token) {
			const { name } = jwt.decode(token);
			setState({ ...state, name, resetPasswordLink: token });
		}

		isAuthenticated() && Router.push('/');
	}, [router]);

	const handleChange = (e) => {
		setState({
			...state,
			newPassword: e.target.value,
			success: '',
			error: '',
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put(`${API}/reset-password`, {
				resetPasswordLink,
				newPassword,
			});
			setState({
				...state,
				newPassword: '',
				success: response.data.message,
			});
		} catch (error) {
			setState({ ...state, error: error.response.data.error });
		}
	};

	const resetPasswordForm = () => (
		<form onSubmit={submitHandler}>
			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>New password</label>
					<input
						type='password'
						className='form-control'
						onChange={handleChange}
						value={newPassword}
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
					Hi {name}, Ready to reset your password
				</h3>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{resetPasswordForm()}
			</div>
		</Layout>
	);
};

export default withRouter(ResetPassword);
