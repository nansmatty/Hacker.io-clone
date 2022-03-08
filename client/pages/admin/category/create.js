import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../../components/Layout';
import { API } from '../../../config';
import withAdmin from '../../withAdmin';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert';

const Create = ({ token, user }) => {
	const [state, setState] = useState({
		name: '',
		content: '',
		error: '',
		success: '',
		formData: typeof window !== 'undefined' && new FormData(),
		imageUploadText: 'Upload Image',
	});

	const { name, success, error, formData, imageUploadText, content } = state;

	const handleChange = (name) => (e) => {
		const value = name === 'image' ? e.target.files[0] : e.target.value;
		const imageName =
			name === 'image' ? e.target.files[0].name : 'Upload Image';

		formData.set(name, value);

		setState({
			...state,
			[name]: value,
			error: '',
			success: '',
			imageUploadText: imageName,
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API}/category`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log('CATEGORY CREATE RESPONSE: ', response.data);
			setState({
				...state,
				name: '',
				formData: '',
				content: '',
				imageUploadText: 'Upload Image',
				success: response.data.message,
				error: '',
			});
		} catch (error) {
			setState({
				...state,
				success: '',
				error: error.response.data.error,
			});
		}
	};

	const createCategoryForm = () => (
		<form onSubmit={submitHandler} encType=''>
			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Category Name</label>
					<input
						type='text'
						value={name}
						className='form-control'
						onChange={handleChange('name')}
						autoComplete='true'
						required
					/>
				</div>
			</div>

			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Description</label>
					<textarea
						value={content}
						rows='6'
						className='form-control'
						onChange={handleChange('content')}
						autoComplete='true'
						required
					/>
				</div>
			</div>

			<div className='form-group'>
				<div className='mb-3'>
					<label className='btn btn-outline-primary fw-bold'>
						{imageUploadText}
						<input
							type='file'
							className='form-control'
							accept='image/*'
							onChange={handleChange('image')}
							required
							hidden
						/>
					</label>
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
			<div className='row'>
				<div className='col-md-6 offset-md-3 shadow p-3 rounded'>
					<h3 style={{ letterSpacing: '1px', fontWeight: '600' }}>
						Create Category
					</h3>
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{createCategoryForm()}
				</div>
			</div>
		</Layout>
	);
};

export default withAdmin(Create);
