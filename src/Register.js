import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import strings from './localization/en.json';

const MAIL_REGEX = /^[\w-]+@([\w-]+\.)+[\w-]+/;
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{3,24}$/;

const Register = () => {
	const emailRef = useRef();
	const errorRef = useRef();

	const [email, setEmail] = useState('');
	const [emailFocus, setEmailFocus] = useState(false);
	const [validEmail, setValidEmail] = useState(false);

	const [password, setPassword] = useState('');
	const [passwordFocus, setPasswordFocus] = useState(false);
	const [validPassword, setValidPassword] = useState(false);

	const [match, setMatch] = useState('');
	const [matchFocus, setMatchFocus] = useState(false);
	const [validMatch, setValidMatch] = useState(false);

	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');

	const [errorMessage, setErrorMessage] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	useEffect(() => {
		const result = MAIL_REGEX.test(email);
		setValidEmail(result);
	}, [email]);

	useEffect(() => {
		const result = PASS_REGEX.test(password);
		setValidPassword(result);
		const valid = password === match;
		setValidMatch(valid);
	}, [password, match]);

	useEffect(() => {
		setErrorMessage('');
	}, [email, password, match]);

	const handleRegistration = async(e) => {
		e.preventDefault();
		const v1 = MAIL_REGEX.test(email);
		const v2 = PASS_REGEX.test(password);
		if (firstname == null || lastname == null || !v1 || !v2) {
			setErrorMessage("Enter first name and last name");
			return;
		}
		const payload = { email: email, firstname: firstname, lastname: lastname, password: password };
		const headers = { 'Content-Type': 'application/json' };
		const response = await axios.post('http://localhost:3001/api/user/register', payload, { headers: headers });
		const data = response.data;
		alert(data.status);
		setSuccess(true);
	};

	return (
		<section>
			<p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
			<h2>{strings["register"]}</h2>
			<form onSubmit={handleRegistration}>
				<label htmlFor="email">{strings["email"]}:</label>
				<input
					type="text"
					id="email"
					ref={emailRef}
					autoComplete="off"
					onChange={(e) => setEmail(e.target.value)}
					required
					aria-invalid={validEmail ? "false" : "true"}
					aria-describedby="emailnote"
					onFocus={() => setEmailFocus(true)}
					onBlur={() => setEmailFocus(false)}
				/>
				<p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>E-mail address is invalid, please confirm your entry</p>
				<br/>
				<label htmlFor="firstname">{strings["firstname"]}:</label>
				<input
					type="text"
					id="firstname"
					autoComplete="off"
					onChange={(e) => setFirstname(e.target.value)}
					required
				/>
				<br/>
				<label htmlFor="lastname">{strings["lastname"]}:</label>
				<input
					type="text"
					id="lastname"
					autoComplete="off"
					onChange={(e) => setLastname(e.target.value)}
					required
				/>
				<br/>
				<label htmlFor="password">{strings["password"]}:</label>
				<input
					type="password"
					id="password"
					onChange={(e) => setPassword(e.target.value)}
					required
					aria-invalid={validPassword ? "false" : "true"}
					aria-describedby="passnote"
					onFocus={() => setPasswordFocus(true)}
					onBlur={() => setPasswordFocus(false)}
				/>
				<p id="passnote" className={passwordFocus && password && !validPassword ? "instructions" : "offscreen"}>Password is invalid, please confirm your entry<br/>Must be 8 to 24 characters, must include uppercase and lowercase letters, a number, and a special character.</p>
				<br/>
				<label htmlFor="match">{strings["confirm-password"]}:</label>
				<input
					type="password"
					id="match"
					onChange={(e) => setMatch(e.target.value)}
					required
					aria-invalid={validPassword ? "false" : "true"}
					aria-describedby="matchnote"
					onFocus={() => setMatchFocus(true)}
					onBlur={() => setMatchFocus(false)}
				/>
				<p id="matchnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>Passwords do not match!</p>
				<br/>
				<button disabled={!validEmail || !validPassword || !validMatch ? true : false}>{strings["register"]}</button>
			</form>
		</section>
	);
}

export default Register
