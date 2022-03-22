import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { API } from '../../../config';

const Read = ({ user, token }) => {
	const [state, setState] = useState({
		categories: [],
		error: '',
		success: '',
	});

	const { error, success, categories } = state;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const { data } = await axios.get(`${API}/categories`);
		setState({ ...state, categories: data });
	};

	const deleteCategory = (id) => {
		console.log(id);
	};

	const listOfCategories = () =>
		categories.map((category, index) => (
			<Fragment key={index}>
				<div className='bg-light p-2 col-sm-5 mb-4 border border-dark rounded'>
					<div className='row'>
						<div className='col-sm-4'>
							<img
								src={category.image.url}
								alt={category.name}
								style={{ width: '100px', height: 'auto' }}
								className='pe-3'
							/>
						</div>
						<div className='col-sm-4 d-flex align-items-center justify-content-center'>
							<Link href={`/links/${category.slug}`}>
								<a className='fw-bold text-wrap text-decoration-none text-dark fs-4 py-3'>
									{category.name}
								</a>
							</Link>
						</div>
						<div className='col-sm-4 d-flex align-items-center justify-content-end  '>
							<Link href={`/admin/category/${category.slug}`}>
								<a
									className='btn btn-primary fw-bold me-1'
									style={{ letterSpacing: '1px' }}>
									<img src='/static/images/editPen18dp.png' alt='edit' />
								</a>
							</Link>
							<button
								className='btn btn-danger fw-bold me-1'
								style={{ letterSpacing: '1px' }}
								onClick={() => deleteCategory(category._id)}>
								<img src='/static/images/delete1x.png' alt='edit' />
							</button>
						</div>
					</div>
				</div>
				<div className='col-sm-1'></div>
			</Fragment>
		));

	return (
		<Layout>
			<div className='row'>
				<div className='col-sm-12'>
					<h3 className='fw-bold'>List of Categories</h3>
					<br />
				</div>
			</div>
			<div className='row'>{listOfCategories()}</div>
		</Layout>
	);
};

export default withAdmin(Read);
