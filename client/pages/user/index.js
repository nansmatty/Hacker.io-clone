import { Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import { API } from '../../config';
import Layout from '../../components/Layout';
import withUser from '../withUser';

const User = ({ user, userLinks, token }) => {
	const deleteLink = async (id) => {
		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			try {
				await axios.delete(`${API}/link/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				Router.replace('/user');
			} catch (error) {
				console.log('Category delete ', error);
			}
		}
	};

	const listOfLinks = () => (
		<Fragment>
			{userLinks?.map((link, index) => (
				<div className='alert alert-primary' key={index}>
					<div className='row'>
						<div className='col-md-8'>
							<a
								href={link.url}
								target='_blank'
								className='text-decoration-none'>
								<h5 className='pt-1 '>{link.title}</h5>

								<h6
									className='py-2 text-danger text-decoration-underline'
									style={{ fontSize: '15px' }}>
									{link.url}
								</h6>
							</a>
						</div>
						<div className='col-md-4 pt-1 d-flex justify-content-end'>
							<span className='fw-bold'>
								{moment(link.createdAt).fromNow()} by {link.postedBy.name}
							</span>
						</div>

						<div className='col-md-12'>
							{link.categories?.map((cate, index) => (
								<span
									className='text-success fw-bold text-uppercase me-2'
									style={{ fontSize: '13px' }}
									key={index}>
									{cate.name}
								</span>
							))}

							<span
								className='text-dark fw-bold text-uppercase me-2'
								style={{ fontSize: '13px' }}>
								{link.type}
							</span>
							<span
								className='text-dark fw-bold text-uppercase me-2'
								style={{ fontSize: '13px' }}>
								{link.medium}
							</span>
							<span
								className='text-dark fw-bold text-uppercase me-2 text-end float-end'
								style={{ fontSize: '13px' }}>
								{link.clicks}-Clicks
							</span>
						</div>
						<div className='col-md-12'>
							<div className='pt-1'>
								<Link href={`/user/link/${link._id}`}>
									<a
										className='btn btn-primary text-center fw-bold me-1'
										style={{ letterSpacing: '1px' }}>
										<img src='/static/images/editPen18dp.png' alt='edit' />
									</a>
								</Link>
								<button
									className='btn btn-danger fw-bold me-1'
									onClick={() => deleteLink(link._id)}
									style={{ letterSpacing: '1px' }}>
									<img src='/static/images/delete1x.png' alt='delete' />
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
		</Fragment>
	);
	return (
		<Layout>
			<h3 className='fw-bold my-4' style={{ letterSpacing: '1px' }}>
				Welcome back, {user.name}{' '}
				<span className='badge rounded-pill bg-danger fs-6'>{user.role}</span>
			</h3>
			<hr />
			<div className='row'>
				<div className='col-md-4'>
					{/* <h5 className='fw-bold text-center'>Other Links</h5>
					<hr /> */}
					<ul className='nav flex-column text-center'>
						<li className='nav-item'>
							<Link href='/user/link/create'>
								<a className='nav-link text-decoration-none p-3 fs-6 fw-bold'>
									{' '}
									Submit a Link{' '}
								</a>
							</Link>
						</li>
						<hr />
						<li className='nav-item'>
							<Link href='/user/profile/update'>
								<a className='nav-link text-decoration-none p-3 fs-6 fw-bold'>
									{' '}
									Update Profile{' '}
								</a>
							</Link>
						</li>
						<hr />
					</ul>
				</div>
				<div className='col-md-8'>
					{/* <h5 className='fw-bold text-center'>Your Links</h5>
					<hr /> */}
					{listOfLinks()}
				</div>
			</div>
		</Layout>
	);
};

export default withUser(User);
