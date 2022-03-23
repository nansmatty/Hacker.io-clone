import { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Router from 'next/router';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import Layout from '../../../components/Layout';
import { API } from '../../../config';
import withAdmin from '../../withAdmin';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert';
import 'react-quill/dist/quill.bubble.css';

const UpdateCategory = ({ category, token }) => {
	const [state, setState] = useState({
		name: category.name,
		image: '',
		imagePreview: category.image.url,
		error: '',
		success: '',
	});
	const [content, setContent] = useState(category.content);

	const { name, image, success, error, imagePreview } = state;

	const resizeFile = (file) =>
		Resizer.imageFileResizer(
			file,
			300,
			300,
			'JPEG',
			100,
			0,
			(uri) => {
				setState({ ...state, image: uri, success: '', error: '' });
			},
			'base64'
		);

	const handleImage = async (pic) => {
		try {
			const file = pic;
			await resizeFile(file);
		} catch (err) {
			console.log(err);
		}
	};

	const handleContent = (event) => {
		setContent(event);
		setState({ ...state, success: '', error: '' });
	};

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: '',
			success: '',
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put(
				`${API}/category/${category.slug}`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log('Response updating data: ', response.data);

			setState({
				...state,
				image: '',
				name: '',
				success: 'Link updated successfully',
				error: '',
			});
			setContent('');

			Router.push('/admin/category/read');
		} catch (error) {
			setState({
				...state,
				success: '',
				error: error.response.data.error,
			});
		}
	};

	const updateCategoryForm = () => (
		<form onSubmit={submitHandler}>
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
					<ReactQuill
						theme='bubble'
						value={content}
						onChange={handleContent}
						placeholder='Write Something'
						className='pb-5 mb-3 rounded'
						style={{ border: '1px solid #CED4DA' }}
					/>
				</div>
			</div>

			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Last Image Preview</label>
					<br />
					<img
						src={imagePreview}
						className='thumbnail'
						alt={category.slug}
						height='100'
					/>
				</div>
			</div>

			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'>Upload New Image</label>
					<input
						type='file'
						className='form-control'
						accept='image/*'
						onChange={(e) => handleImage(e.target.files[0])}
					/>
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
			<div className='row'>
				<div className='col-md-6 offset-md-3 shadow p-3 rounded'>
					<h3 style={{ letterSpacing: '1px', fontWeight: '600' }}>
						Update Category
					</h3>
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{updateCategoryForm()}
				</div>
			</div>
		</Layout>
	);
};

UpdateCategory.getInitialProps = async ({ query, req, token }) => {
	const { data } = await axios.post(`${API}/category/${query.update_slug}`);

	console.log('Category', data?.category);

	return {
		token,
		category: data.category,
	};
};

export default withAdmin(UpdateCategory);
