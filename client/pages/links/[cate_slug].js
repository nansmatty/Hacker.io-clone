import { useState, Fragment, useEffect } from 'react';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import Layout from '../../components/Layout';
import { API, APP_NAME } from '../../config';
import parse from 'html-react-parser';

const CategoryBasedLinks = ({
	query,
	links,
	category,
	totalLinks,
	linksLimit,
	linksSkip,
}) => {
	const [allLinks, setAllLinks] = useState(links);
	const [popularLinks, setPopularLinks] = useState([]);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);

	const stripeHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, '');

	const headSEO = () => (
		<Head>
			<title>
				{category.name} | {APP_NAME}
			</title>
			<meta
				name='description'
				content={stripeHTML(category.content.substring(0, 160))}
			/>
			<meta property='og:title' content={category.name} />
			<meta
				property='og:description'
				content={stripeHTML(category.content.substring(0, 160))}
			/>
			<meta property='og:image' content={category.image.url} />
			<meta property='og:image:secure_url' content={category.image.url} />
		</Head>
	);

	const itemsHasMore = () => {
		if (size > 0 && size >= limit) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		loadPopularLinks();
	}, []);

	const handleClick = async (linkId) => {
		await axios.put(`${API}/click-count`, { linkId });
		loadUpdatedLinks();
	};

	const handleClickPopularLinks = async (linkId) => {
		await axios.put(`${API}/click-count`, { linkId });
		loadPopularLinks();
	};

	const loadUpdatedLinks = async () => {
		const { data } = await axios.post(`${API}/category/${query.cate_slug}`);
		setAllLinks(data.link);
	};

	const loadPopularLinks = async () => {
		const { data } = await axios.get(`${API}/link/popular/${query.cate_slug}`);
		setPopularLinks(data);
	};

	const listOfLinks = () => (
		<Fragment>
			{allLinks?.map((link, index) => (
				<div className='alert alert-primary' key={index}>
					<div className='row'>
						<div className='col-md-8' onClick={(e) => handleClick(link._id)}>
							<a
								href={link.url}
								target='_blank'
								rel='noreferrer'
								className='text-decoration-none'>
								<h5 className='pt-1'>{link.title}</h5>
								<h6
									className='py-2 text-danger text-decoration-underline'
									style={{ fontSize: '15px' }}>
									{link.url}
								</h6>
							</a>
						</div>
						<div className='col-md-4 pt-1 d-flex justify-content-end'>
							<span className='fw-bold text-truncate'>
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
					</div>
				</div>
			))}
		</Fragment>
	);

	const mostPopularLinks = () => (
		<Fragment>
			{popularLinks?.map((link, index) => (
				<div className='alert alert-success' key={index}>
					<div className='row'>
						<div
							className='col-md-12'
							onClick={() => handleClickPopularLinks(link._id)}>
							<a
								href={link.url}
								target='_blank'
								rel='noreferrer'
								className='text-decoration-none'>
								<h5 className='pt-1 text-truncate'>{link.title}</h5>
								<h6
									className='py-2 text-danger text-decoration-underline'
									style={{ fontSize: '15px' }}>
									{link.url}
								</h6>
							</a>
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

	const loadMore = async () => {
		let toSkip = skip + limit;
		const { data } = await axios.post(`${API}/category/${query.cate_slug}`, {
			skip: toSkip,
			limit,
		});
		setAllLinks([...allLinks, ...data.link]);
		setSize(data.link.length);
		setSkip(toSkip);
	};

	return (
		<Fragment>
			{headSEO()}
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
						<InfiniteScroll
							pageStart={0}
							loadMore={loadMore}
							hasMore={itemsHasMore()}
							loader={
								<img key={0} src='/static/images/loading.gif' alt='loading' />
							}>
							{listOfLinks()}
						</InfiniteScroll>
					</div>
					<div className='col-md-4'>
						<div className='d-flex justify-content-center'>
							<h3 className='fw-bold text-truncate'>
								Most Popular Links of {category.name}
							</h3>
						</div>
						<br />
						{mostPopularLinks()}
					</div>
				</div>
			</Layout>
		</Fragment>
	);
};

CategoryBasedLinks.getInitialProps = async ({ query, req }) => {
	let skip = 0,
		limit = 2;

	const { data } = await axios.post(`${API}/category/${query.cate_slug}`, {
		skip,
		limit,
	});

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
