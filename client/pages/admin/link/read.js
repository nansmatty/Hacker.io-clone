import React, { useState, Fragment } from 'react';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'next/link';
import axios from 'axios';
import Layout from '../../../components/Layout';
import { API } from '../../../config';
import parse from 'html-react-parser';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

const AllLinks = ({ token, links, totalLinks, linksLimit, linksSkip }) => {
	const [allLinks, setAllLinks] = useState(links);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);

	const deleteLink = async (id) => {
		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			try {
				await axios.delete(`${API}/admin/link/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				typeof window !== 'undefined' && window.location.reload();
			} catch (error) {
				console.log('Category delete ', error);
			}
		}
	};

	// const handleClick = async (linkId) => {
	// 	await axios.put(`${API}/click-count`, { linkId });
	// 	// typeof window !== 'undefined' && window.location.reload();
	// };

	const listOfLinks = () => (
		<Fragment>
			{allLinks?.map((link, index) => (
				<div className='alert alert-success' key={index}>
					<div className='row'>
						<div className='col-md-8'>
							{/* onClick={(e) => handleClick(link._id)} */}
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

							<br />

							<div className='pt-2'>
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

	const loadMore = async () => {
		let toSkip = skip + limit;
		const { data } = await axios.post(
			`${API}/links`,
			{
				skip: toSkip,
				limit,
			},
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		setAllLinks([...allLinks, ...data]);
		setSize(data.length);
		setSkip(toSkip);
	};

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-12'>
					<h2 className='fw-bold'>URL / Links</h2>
					<br />
					<InfiniteScroll
						pageStart={0}
						loadMore={loadMore}
						hasMore={size > 0 && size >= limit}
						loader={
							<img key={0} src='/static/images/loading.gif' alt='loading' />
						}>
						{listOfLinks()}
					</InfiniteScroll>
				</div>
			</div>
		</Layout>
	);
};

AllLinks.getInitialProps = async ({ req }) => {
	let skip = 0,
		limit = 2;

	const token = await getCookie('token', req);

	console.log('Token from getInitialProps : ', token);

	const { data } = await axios.post(
		`${API}/links`,
		{
			skip,
			limit,
		},
		{ headers: { Authorization: `Bearer ${token}` } }
	);

	// console.log('Link', data);

	return {
		totalLinks: data.length,
		links: data,
		linksLimit: limit,
		linksSkip: skip,
		token,
	};
};

export default withAdmin(AllLinks);
