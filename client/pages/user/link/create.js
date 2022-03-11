import { useEffect, useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Layout from '../../../components/Layout';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert';
import withUser from '../../withUser';
import { isAuthenticated } from '../../../helpers/auth';

const CreateLink = ({ token, user }) => {
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
		console.log(data);
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

		console.log(all);
		setState({ ...state, categories: all, error: '', success: '' });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const showCategories = () => {
		return loadedCategories?.map((category) => (
			<li className='list-unstyled' key={category._id}>
				<input
					type='checkbox'
					onChange={handleToggle(category._id)}
					className='me-2'
				/>
				<label className='form-check-label'>{category.name}</label>
			</li>
		));
	};

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
					<button className='btn btn-outline-primary fw-bold' type='submit'>
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
					{error && showErrorMessage}
					{success && showSuccessMessage}
				</div>
			</div>
			<div className='row'>
				<div className='col-md-4'>
					<div className='form-group'>
						<label className='fw-bold mb-2'>Category</label>
						<ul style={{ maxHeight: '150px', overflowY: 'scroll' }}>
							{showCategories()}
						</ul>
					</div>
				</div>
				<div className='col-md-8'>{submitLinkForm()}</div>
			</div>
		</Layout>
	);
};

export default CreateLink;
