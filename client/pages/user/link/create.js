import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Layout from '../../../components/Layout';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert';
import { getCookie, isAuthenticated } from '../../../helpers/auth';

const CreateLink = ({ token }) => {
	const [state, setState] = useState({
		title: '',
		url: '',
		categories: [],
		loadedCategories: [],
		success: '',
		error: '',
		type: '',
		medium: '',
	});

	const {
		title,
		url,
		categories,
		loadedCategories,
		success,
		error,
		type,
		medium,
	} = state;

	useEffect(() => {
		// !isAuthenticated() && Router.push('/login');
		loadCategories();
	}, [success]);

	const loadCategories = async () => {
		const { data } = await axios.get(`${API}/categories`);
		setState({ ...state, loadedCategories: data });
	};

	const handleTitleChange = (e) => {
		setState({ ...state, title: e.target.value, error: '', success: '' });
	};
	const handleURLChange = (e) => {
		setState({ ...state, url: e.target.value, error: '', success: '' });
	};
	const handleToggle = (cid) => () => {
		const clickedCategory = categories.indexOf(cid);
		const all = [...categories];

		if (clickedCategory === -1) {
			all.push(cid);
		} else {
			all.splice(clickedCategory, 1);
		}

		setState({ ...state, categories: all, error: '', success: '' });
	};

	const handleTypeClick = (e) => {
		setState({ ...state, type: e.target.value, success: '', error: '' });
	};

	const handleMediumClick = (e) => {
		setState({ ...state, medium: e.target.value, success: '', error: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${API}/link`,
				{
					title,
					url,
					categories,
					type,
					medium,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log('LINK CREATE RESPONSE: ', response.data);
			setState({
				...state,
				title: '',
				url: '',
				categories: [],
				loadedCategories: [],
				type: '',
				medium: '',
				success: response.data.message,
				error: '',
			});
		} catch (error) {
			console.log('LINK CREATE ERROR: ', error);
			setState({
				...state,
				success: '',
				error: error.response.data.error,
			});
		}
	};

	const showCategories = () => {
		return (
			<Fragment>
				{loadedCategories?.map((category) => (
					<li className='list-unstyled' key={category._id}>
						<input
							type='checkbox'
							onChange={handleToggle(category._id)}
							className='me-2'
						/>
						<label className='form-check-label'>{category.name}</label>
					</li>
				))}
			</Fragment>
		);
	};

	const showTypes = () => (
		<Fragment>
			<div className='form-check ms-4'>
				<label className='form-check-label'>
					<input
						type='radio'
						onClick={handleTypeClick}
						checked={type === 'free'}
						value='free'
						className='form-check-input'
						name='type'
					/>
					Free
				</label>
			</div>
			<div className='form-check ms-4'>
				<label className='form-check-label'>
					<input
						type='radio'
						onClick={handleTypeClick}
						checked={type === 'paid'}
						value='paid'
						className='form-check-input'
						name='type'
					/>
					Paid
				</label>
			</div>
		</Fragment>
	);

	const showMedium = () => (
		<Fragment>
			<div className='form-check ms-4'>
				<label className='form-check-label'>
					<input
						type='radio'
						onClick={handleMediumClick}
						checked={medium === 'book'}
						value='book'
						className='form-check-input'
						name='medium'
					/>
					Book
				</label>
			</div>
			<div className='form-check ms-4'>
				<label className='form-check-label'>
					<input
						type='radio'
						onClick={handleMediumClick}
						checked={medium === 'video'}
						value='video'
						className='form-check-input'
						name='medium'
					/>
					Video
				</label>
			</div>
		</Fragment>
	);

	const submitLinkForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group mb-3'>
				<label className='form-label fw-bold'>Title</label>
				<input
					type='text'
					className='form-control'
					value={title}
					onChange={handleTitleChange}
				/>
			</div>
			<div className='form-group mb-3'>
				<label className='form-label fw-bold'>URL</label>
				<input
					type='text'
					className='form-control'
					value={url}
					onChange={handleURLChange}
				/>
			</div>
			<div className='form-group'>
				<div className='mb-3'>
					<button
						disabled={!isAuthenticated || !token}
						className='btn btn-outline-primary fw-bold'
						type='submit'>
						Submit
					</button>
				</div>
			</div>
		</form>
	);

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-12'>
					<h3 style={{ letterSpacing: '1px', fontWeight: '600' }}>
						Submit Link / URL
					</h3>
					<br />
					{!isAuthenticated ||
						(!token && (
							<div className='alert alert-warning fw-bold'>
								You need to login first to submit a link!
							</div>
						))}
					{error && showErrorMessage}
					{success && showSuccessMessage}
				</div>
			</div>
			<div className='row'>
				<div className='col-md-3'>
					<div className='form-group'>
						<label className='fw-bold mb-2'>Category</label>
						<ul style={{ maxHeight: '150px', overflowY: 'scroll' }}>
							{showCategories()}
						</ul>
					</div>
					<div className='form-group'>
						<label className='fw-bold mb-2'>Type</label>
						{showTypes()}
					</div>
					<div className='form-group'>
						<label className='fw-bold mb-2'>Medium</label>
						{showMedium()}
					</div>
				</div>
				<div className='col-md-9'>{submitLinkForm()}</div>
				{/* {JSON.stringify(medium)} */}
			</div>
		</Layout>
	);
};

CreateLink.getInitialProps = ({ req }) => {
	const token = getCookie('token', req);
	return { token };
};

export default CreateLink;
