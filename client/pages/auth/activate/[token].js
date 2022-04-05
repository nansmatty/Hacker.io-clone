import { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alert';
import Layout from '../../../components/Layout';
import { API } from '../../../config';

const ActivateAccount = ({ router }) => {
	const [userState, setUserState] = useState({
		name: '',
		tokenId: '',
		buttonText: 'Activate Account',
		success: '',
		error: '',
	});

	const { name, error, success, buttonText, tokenId } = userState;

	useEffect(() => {
		let token = router.query.token;
		console.log(token);

		if (token) {
			const { name } = jwt.decode(token);
			setUserState({ ...userState, name, tokenId: token });
		}
	}, [router, userState]);

	const clickSubmit = async (e) => {
		e.preventDefault();
		setUserState({ ...userState, buttonText: 'Activating' });
		try {
			const response = await axios.post(`${API}/register/activate`, {
				tokenId,
			});

			setUserState({
				...userState,
				name: '',
				tokenId: '',
				buttonText: 'Activated',
				success: response.data.message,
			});
		} catch (error) {
			setUserState({
				...userState,
				buttonText: 'Activate Account',
				error: error.response.data.error,
			});
		}
	};

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-6 offset-md-3'>
					<h2>Welcome {name}, Ready to activate your account?</h2>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					<div className='d-grid gap-2'>
						<button className='btn btn-warning btn-block' onClick={clickSubmit}>
							<strong>{buttonText}</strong>
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default withRouter(ActivateAccount);
