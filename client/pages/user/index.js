import Layout from '../../components/Layout';
import axios from 'axios';
import { API } from '../../config';
import { getCookie } from '../../helpers/auth';
import { useEffect } from 'react';

const User = ({ user }) => {
	return (
		<Layout>
			<h1>UserPage</h1>
			{JSON.stringify(user)}
		</Layout>
	);
};

User.getInitialProps = async (context) => {
	const token = getCookie('token', context.req);
	try {
		const response = await axios.get(`${API}/user`, {
			headers: {
				authorization: `Bearer ${token}`,
				contentType: 'application/json',
			},
		});
		return { user: response.data };
	} catch (error) {
		if (error.response.status === 401) {
			return { user: 'no user' };
		}
	}
};

export default User;
