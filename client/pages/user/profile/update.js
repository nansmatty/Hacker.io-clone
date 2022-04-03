import { useState, useEffect, Fragment } from 'react';
import Layout from '../../../components/Layout';
import Router from 'next/router';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert';
import { API } from '../../../config';
import withUser from '../../withUser';
import { updateUserInLocalStorage } from '../../../helpers/auth';

const UpdateProfile = ({ user, token }) => {
	const [stateValues, setStateValues] = useState({
		name: user.name,
		email: user.email,
		password: '',
		error: '',
		success: '',
		loadedCategories: [],
		categories: user.categories,
	});

	const {
		name,
		email,
		password,
		error,
		success,
		loadedCategories,
		categories,
	} = stateValues;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const { data } = await axios.get(`${API}/categories`);
		setStateValues({ ...stateValues, loadedCategories: data });
	};

	const handleToggle = (cid) => () => {
		const clickedCategory = categories.indexOf(cid);
		const all = [...categories];

		if (clickedCategory === -1) {
			all.push(cid);
		} else {
			all.splice(clickedCategory, 1);
		}

		setStateValues({ ...stateValues, categories: all, error: '', success: '' });
	};

	const showCategories = () => {
		return (
			<Fragment>
				{loadedCategories?.map((category) => (
					<li className='list-unstyled' key={category._id}>
						<input
							type='checkbox'
							checked={categories.includes(category._id)}
							onChange={handleToggle(category._id)}
							className='me-2'
						/>
						<label className='form-check-label'>{category.name}</label>
					</li>
				))}
			</Fragment>
		);
	};

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
			const response = await axios.put(
				`${API}/user`,
				{
					name,
					password,
					categories,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			updateUserInLocalStorage(response.data, () => {
				setStateValues({
					...stateValues,
					success: 'Profile updated successfully',
				});
			});
		} catch (error) {
			setStateValues({ ...stateValues, error: error.response.data.error });
		}
	};
	const updateProfileForm = () => (
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
						disabled
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
					<label className='fw-bold mb-2'>Category</label>
					<br />
					<span>Please check those categories you're interested</span>
					<ul style={{ maxHeight: '150px', overflowY: 'scroll' }}>
						{showCategories()}
					</ul>
				</div>
			</div>
			<div className='form-group'>
				<div className='mb-3'>
					<button className='btn btn-outline-success fw-bold'>Update</button>
				</div>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className='col-md-6 offset-md-3 shadow p-3 rounded'>
				<h3 style={{ letterSpacing: '1px', fontWeight: '600' }}>
					Update Profile
				</h3>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{updateProfileForm()}
			</div>
		</Layout>
	);
};

export default withUser(UpdateProfile);
