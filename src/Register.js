import { useEffect, useRef, useState } from "react";

const MAIL_REGEX = /^[\w-]+@([\w-]+\.)+[\w-]+/;
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{3,24}$/;

const Register = () => {
	const emailRef = useRef();
	const errorRef = useRef();

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [pass, setPass] = useState('');
	const [validPass, setValidPass] = useState(false);
	const [passFocus, setPassFocus] = useState(false);

	const [match, setMatch] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		emailRef.current.focus();
	}, [])

	useEffect(() => {
		const result = MAIL_REGEX.test(email);
		setValidEmail(result);
	}, [email])

	useEffect(() => {
		const result = PASS_REGEX.test(pass);
		setValidPass(result);
		const valid = pass === match;
		setValidMatch(valid);
	}, [pass, match])

	useEffect(() => {
		setErrorMessage('');
	}, [email, pass, match])

	const handleRegistration = async(e) => {
		e.preventDefault();
		const v1 = MAIL_REGEX.test(email);
		const v2 = PASS_REGEX.test(pass);
		if (!v1 || !v2) {
			setErrorMessage("Invalid entry");
			return;
		}
		fetch('/user/1')
			.then(response => {
				console.log(response);
				return response.json()
			})
		//console.log(email, pass);
		setSuccess(true)
	}

	return (
		<section>
			<p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
			<h2>Register</h2>
			<form onSubmit={handleRegistration}>
				<label htmlFor="email">Email:</label>
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

				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					onChange={(e) => setPass(e.target.value)}
					required
					aria-invalid={validPass ? "false" : "true"}
					aria-describedby="passnote"
					onFocus={() => setPassFocus(true)}
					onBlur={() => setPassFocus(false)}
				/>
				<p id="passnote" className={passFocus && pass && !validPass ? "instructions" : "offscreen"}>Password is invalid, please confirm your entry<br/>Must be 8 to 24 characters, must include uppercase and lowercase letters, a number, and a special character.</p>

				<label htmlFor="password">Confirm Password:</label>
				<input
					type="password"
					id="match"
					onChange={(e) => setMatch(e.target.value)}
					required
					aria-invalid={validPass ? "false" : "true"}
					aria-describedby="matchnote"
					onFocus={() => setMatchFocus(true)}
					onBlur={() => setMatchFocus(false)}
				/>
				<p id="matchnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>Passwords do not match!</p>

				<button disabled={!validEmail || !validPass || !validMatch ? true : false}>Register</button>
			</form>
		</section>
	)
}

export default Register
