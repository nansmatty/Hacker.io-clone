import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { API, APP_NAME } from '../config';

const Home = ({ categories }) => {
	const [popularLinks, setPopularLinks] = useState([]);

	const headSEO = () => (
		<Head>
			<title>{APP_NAME}</title>
			<meta
				name='description'
				content='A website were you can find most popular courses links. Best site for students who want level up there skills.'
			/>
			<meta property='og:title' content={APP_NAME} />
			<meta
				property='og:description'
				content='A website were you can find most popular courses links. Best site for students who want level up there skills.'
			/>
		</Head>
	);

	useEffect(() => {
		loadPopularLinks();
	}, []);

	const loadPopularLinks = async () => {
		const { data } = await axios.get(`${API}/link/popular`);

		setPopularLinks(data);
		console.log(popularLinks);
	};

	const handleClick = async (linkId) => {
		await axios.put(`${API}/click-count`, { linkId });
		loadPopularLinks();
	};

	const listCategories = () =>
		categories.map((category, index) => (
			<Link href={`/links/${category.slug}`} key={index}>
				<a className='bg-light p-2 col-md-4 mb-3 border border-dark text-decoration-none text-dark rounded '>
					<div className='row'>
						<div className='col-md-4 col-sm-6'>
							<img
								src={category.image.url}
								alt={category.name}
								style={{ width: '100px', height: 'auto' }}
								className='pe-3'
							/>
						</div>
						<div className='col-md-8 col-sm-6 d-flex align-items-center text-center'>
							<h4 className='fw-bold text-wrap p-1'>{category.name}</h4>
						</div>
					</div>
				</a>
			</Link>
		));

	const trendingLinks = () => (
		<Fragment>
			{popularLinks?.map((link, index) => (
				<div className='alert alert-primary' key={index}>
					<div className='row'>
						<div className='col-md-8' onClick={(e) => handleClick(link._id)}>
							<a
								href={link.url}
								target='_blank'
								rel='noreferrer'
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
							{link?.categories?.map((cate, index) => (
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
					</div>
				</div>
			))}
		</Fragment>
	);

	return (
		<Fragment>
			{headSEO()}
			<Layout>
				<div className='row'>
					<div className='col-md-12'>
						<h3 className='fw-bold'>Browse Tutorials / Courses</h3>
						<br />
					</div>
				</div>
				<div className='row'>{listCategories()}</div>
				<div className='row'>
					<div className='col-md-12'>
						<h3 className='fw-bold mt-5'>Trending Links</h3>
						<br />
					</div>
				</div>
				<div className='row'>{trendingLinks()}</div>
			</Layout>
		</Fragment>
	);
};

Home.getInitialProps = async () => {
	const { data } = await axios.get(`${API}/categories`);
	return {
		categories: data,
	};
};

export default Home;
