import axios from 'axios';
import Link from 'next/link';
import Layout from '../components/Layout';
import { API } from '../config';

const Home = ({ categories }) => {
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

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-12'>
					<h3 className='fw-bold'>Browse Tutorials / Courses</h3>
					<br />
				</div>
			</div>
			<div className='row'>{listCategories()}</div>
		</Layout>
	);
};

Home.getInitialProps = async () => {
	const { data } = await axios.get(`${API}/categories`);
	return {
		categories: data,
	};
};

export default Home;
