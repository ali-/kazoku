import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import strings from './localization/en.json';


const Login = () => {
	const emailRef = useRef();
	const errorRef = useRef();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	const handleLogin = async(e) => {
		e.preventDefault();
		if (email == "" || password == "") {
			setErrorMessage("Enter email and password");
			return;
		}
		setErrorMessage("");
		const payload = { email: email, password: password };
		const headers = { 'Content-Type': 'application/json' };
		const response = await axios.post('http://localhost:3001/api/user/login', payload, { headers: headers });
		const data = response.data;
		if (data.status == "error") { alert(`Error: ${data.error}`); }
		else { setSuccess(true); }
	};

	return (
		<section>
			<p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"}>{errorMessage}</p>
			<h2>{strings["login"]}</h2>
			<form onSubmit={handleLogin} autoComplete="off">
				<label htmlFor="email">{strings["email"]}:</label>
				<input
					type="text"
					id="email"
					ref={emailRef}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<br/>
				<label htmlFor="password">{strings["password"]}:</label>
				<input
					type="password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<br/>
				<button>{strings["login"]}</button>
			</form>
		</section>
	);
}


export default Login;
