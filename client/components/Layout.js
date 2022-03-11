import React, { useEffect, useState } from 'react';
// import Head from 'next/head';
import Link from 'next/link';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'next/router';
import { isAuthenticated, logout } from '../helpers/auth';

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
				<Link href='/user/link/create'>
					<a
						className='nav-link text-white fw-bold text-decoration-underline'
						style={{ letterSpacing: '1px' }}>
						Submit a link
					</a>
				</Link>
			</li>
			{!isAuthenticated() && (
				<React.Fragment>
					<li className='nav-item ms-auto'>
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
				</React.Fragment>
			)}
			{isAuthenticated() && isAuthenticated().role === 'admin' && (
				<li className='nav-item ms-auto'>
					<Link href='/admin'>
						<a
							className='nav-link text-white fw-bold'
							style={{ letterSpacing: '1px' }}>
							{`Welcome ${isAuthenticated().name}`}
						</a>
					</Link>
				</li>
			)}

			{isAuthenticated() && isAuthenticated().role === 'suscriber' && (
				<li className='nav-item ms-auto'>
					<Link href='/user'>
						<a
							className='nav-link text-white fw-bold'
							style={{ letterSpacing: '1px' }}>
							{`Welcome ${isAuthenticated().name}`}
						</a>
					</Link>
				</li>
			)}
			{isAuthenticated() && (
				<li className='nav-item'>
					<a
						className='nav-link text-white fw-bold'
						onClick={logout}
						style={{ letterSpacing: '1px' }}>
						Logout
					</a>
				</li>
			)}
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
