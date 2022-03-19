import React, { useState, Fragment } from 'react';
import moment from 'moment';
import Link from 'next/link';
import axios from 'axios';
import Layout from '../../components/Layout';
import { API } from '../../config';
import parse from 'html-react-parser';
import { set } from 'nprogress';

const CategoryBasedLinks = ({
	query,
	links,
	category,
	totalLinks,
	linksLimit,
	linksSkip,
}) => {
	const [allLinks, setAllLinks] = useState(links);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);

	const listOfLinks = () => (
		<Fragment>
			{allLinks?.map((link, index) => (
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
							</div>
						</div>
					</div>
				</div>
			))}
		</Fragment>
	);

	const loadMore = async () => {
		let toSkip = skip + limit;
		const { data } = await axios.post(`${API}/category/${query.cate_slug}`, {
			skip: toSkip,
			limit,
		});
		console.log('All Links', allLinks);
		setAllLinks([...allLinks, ...data.link]);
		console.log('Links length', data.link.length);
		setSize(data.link.length);
		setSkip(toSkip);
	};

	const loadMoreButton = () => {
		return (
			size > 0 &&
			size >= limit && (
				<button onClick={loadMore} className='btn btn-outline-primary btn-lg'>
					Load More
				</button>
			)
		);
	};

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-8'>
					<h2 className='fw-bold mb-4'>{category.name} - URL / Links</h2>
					<div className='alert alert-secondary py-4 fs-5'>
						{parse(category.content)}
					</div>
				</div>
				<div className='col-md-4 d-flex justify-content-center'>
					<img
						src={category.image.url}
						alt={category.name}
						style={{ width: 'auto', maxHeight: '200px' }}
					/>
					<br />
					<br />
				</div>
			</div>
			<br />
			<div className='row'>
				<div className='col-md-8'>
					<h3 className='fw-bold'>Links</h3>
					<br />
					{listOfLinks()}
				</div>
				<div className='col-md-4 d-flex justify-content-center'>
					<h3 className='fw-bold'>Most Popular Links of {category.name}</h3>
				</div>
				<div className='text-center pb-5 pt-4'>{loadMoreButton()}</div>
			</div>
		</Layout>
	);
};

CategoryBasedLinks.getInitialProps = async ({ query, req }) => {
	let skip = 0,
		limit = 1;

	const { data } = await axios.post(`${API}/category/${query.cate_slug}`, {
		skip,
		limit,
	});

	console.log('Link', data?.link);

	return {
		query,
		category: data.category,
		links: data.link,
		totalLinks: data.link.length,
		linksLimit: limit,
		linksSkip: skip,
	};
};

export default CategoryBasedLinks;
