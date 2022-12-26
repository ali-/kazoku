import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import strings from './localization/en.json';


const Photo = () => {
	const captionRef = useRef();
	const errorRef = useRef();
	const [caption, setCaption] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		captionRef.current.focus();
	}, []);

	const handlePhoto = async(e) => {
		e.preventDefault();
		alert("Uploading photo");
	};

	return (
		<section>
			<p ref={errorRef} className={errorMessage ? "errorMessage" : "offscreen"}>{errorMessage}</p>
			<h2>{strings["upload"]}</h2>
			<form onSubmit={handlePhoto} autoComplete="off">
				<label htmlFor="caption">{strings["caption"]}:</label>
				<input
					type="text"
					id="caption"
					ref={captionRef}
					onChange={(e) => setCaption(e.target.value)}
					required
				/>
				<br/>
				<button>{strings["upload"]}</button>
			</form>
		</section>
	);
}


export default Photo;
