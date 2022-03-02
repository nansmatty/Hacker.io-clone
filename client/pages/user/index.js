import Layout from '../../components/Layout';
import axios from 'axios';
import { API } from '../../config';
import withUser from '../withUser';

const User = ({ user }) => {
	return (
		<Layout>
			<h1>UserPage</h1>
			<p>{JSON.stringify(user)}</p>
		</Layout>
	);
};

export default withUser(User);
