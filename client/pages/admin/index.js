import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';

const Admin = ({ user }) => {
	return (
		<Layout>
			<h1>AdminPage</h1>
			{JSON.stringify(user)}
		</Layout>
	);
};

export default withAdmin(Admin);
