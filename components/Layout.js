import React, { useEffect } from 'react';
// import Head from 'next/head';
import Link from 'next/link';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
	const router = useRouter();

	useEffect(() => {
		const handleStart = (url) => {
			NProgress.start();
		};
		const handleStop = () => {
			NProgress.done();
		};

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleStop);
		router.events.on('routeChangeError', handleStop);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleStop);
			router.events.off('routeChangeError', handleStop);
		};
	}, [router]);

	const header = () => (
		<React.Fragment>
			<link rel='stylesheet' href='/static/css/styles.css' />
		</React.Fragment>
	);

	const nav = () => (
		<ul className='nav nav-tabs bg-primary p-2'>
			<li className='nav-item'>
				<Link href='/'>
					<a
						className='nav-link text-white fw-bold'
						style={{ letterSpacing: '1px' }}>
						Home
					</a>
				</Link>
			</li>
			<li className='nav-item'>
				<Link href='/login'>
					<a
						className='nav-link text-white fw-bold'
						style={{ letterSpacing: '1px' }}>
						Login
					</a>
				</Link>
			</li>
			<li className='nav-item'>
				<Link href='/register'>
					<a
						className='nav-link text-white fw-bold'
						style={{ letterSpacing: '1px' }}>
						Register
					</a>
				</Link>
			</li>
		</ul>
	);

	return (
		<React.Fragment>
			{header()}
			{nav()}
			<div className='container py-4'>{children}</div>
		</React.Fragment>
	);
};

export default Layout;
