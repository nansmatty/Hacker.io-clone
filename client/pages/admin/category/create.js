import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import Layout from '../../../components/Layout';
import { API } from '../../../config';
import withAdmin from '../../withAdmin';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert';
import 'react-quill/dist/quill.bubble.css';

const Create = ({ token, user }) => {
	const [state, setState] = useState({
		name: '',
		error: '',
		success: '',
		image: '',
	});
	const [content, setContent] = useState('');

	const { name, success, error, image } = state;

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
			const response = await axios.post(
				`${API}/category`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log('CATEGORY CREATE RESPONSE: ', response.data);
			setState({
				...state,
				name: '',
				formData: '',
				image: '',
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
					<ReactQuill
						theme='bubble'
						value={content}
						onChange={handleChange}
						placeholder='Write Something'
						className='pb-5 mb-3 rounded'
						style={{ border: '1px solid #CED4DA' }}
					/>
				</div>
			</div>

			<div className='form-group'>
				<div className='mb-3'>
					<label className='form-label fw-bold'></label>
					<input
						type='file'
						className='form-control'
						accept='image/*'
						onChange={(e) => handleImage(e.target.files[0])}
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
