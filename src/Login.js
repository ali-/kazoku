import { useEffect, useRef, useState } from "react";
import axios, * as others from 'axios';
import strings from './localization/en.json';

const Login = () => {
	const emailRef = useRef();
	const errorRef = useRef();

	const [email, setEmail] = useState('');
	const [emailFocus, setEmailFocus] = useState(false);
	const [validEmail, setValidEmail] = useState(false);

	const [password, setPassword] = useState('');
	const [passwordFocus, setPasswordFocus] = useState(false);
	const [validPassword, setValidPassword] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	useEffect(() => {
		const result = (email.length > 0) ? true : false;
		setValidEmail(result);
	}, [email]);

	useEffect(() => {
		const result = (password.length > 0) ? true : false;
		setValidPassword(result);
	}, [password]);

	useEffect(() => {
		setErrorMessage('');
	}, [email, password]);

	const handleLogin = async(e) => {
		e.preventDefault();
		if (email == null || password == null) {
			setErrorMessage("Enter email and password");
			return;
		}
		const payload = { email: email, password: password };
		const headers = { 'Content-Type': 'application/json' };
		const response = await axios.post('http://localhost:3001/api/user/login', payload, { headers: headers });
		const data = response.data;
		alert(data.status);
		setSuccess(true);
	};

	return (
		<section>
			<p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
			<h2>{strings["login"]}</h2>
			<form onSumbit={handleLogin}>
				<label htmlFor="email">{strings["email"]}:</label>
				<input
					type="text"
					id="email"
					ref={emailRef}
					onChange={(e) => setEmail(e.target.value)}
					required
					aria-invalid={validEmail ? "false" : "true"}
					onFocus={() => setEmailFocus(true)}
					onBlur={() => setEmailFocus(false)}
				/>
				<br/>
				<label htmlFor="password">{strings["password"]}:</label>
				<input
					type="password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
					required
					aria-invalid={validPassword ? "false" : "true"}
					onFocus={() => setPasswordFocus(true)}
					onBlur={() => setPasswordFocus(false)}
				/>
				<br/>
				<button>{strings["login"]}</button>
			</form>
		</section>
	);
}

export default Login;
