import cookie from 'js-cookie';
import Router from 'next/router';
// set in cookie

export const setCookie = (key, value) => {
	if (typeof window !== 'undefined') {
		cookie.set(key, value, {
			expires: 1,
		});
	}
};

// get from cookie such as stored token
//will be useful when we need to make request to server with auth token

export const getCookie = (key) => {
	if (typeof window !== 'undefined') {
		return cookie.get(key);
	}
};

// remove cookie on logout

export const removeCookie = (key) => {
	if (typeof window !== 'undefined') {
		cookie.remove(key);
	}
};

// set in localstorage
export const setLocalStorage = (key, value) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

// remove fro localstorage
export const removeLocalStorage = (key) => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(key);
	}
};

// authenticate user by passing data to cookie  and localstorage during signin

export const authenticate = (data, next) => {
	setCookie('token', data.token);
	setLocalStorage('user', data.user);
	next();
};

//access user info from localstorage
export const isAuthenticated = () => {
	if (typeof window !== 'undefined') {
		const cookieChecked = getCookie('token');
		if (cookieChecked) {
			if (localStorage.getItem('user')) {
				return JSON.parse(localStorage.getItem('user'));
			} else {
				return false;
			}
		}
	}
};

export const logout = () => {
	removeCookie('token');
	removeLocalStorage('user');
	Router.push('/login');
};
