import { useState } from "react";
import axios from 'axios';
import strings from './localization/en.json';


const Photo = () => {
	const [upload, setUpload] = useState()

	function handleChange(event) {
		setUpload(event.target.files[0]);
	};

	const handlePhoto = (event) => {
		event.preventDefault();
		const headers = { 'content-type': 'multipart/form-data' };
		const payload = new FormData();
		payload.append('upload', upload);
		axios
			.post('http://localhost:3001/api/photo/create', payload, {
				headers: headers,
				withCredentials: true
			})
			.then((response) => {
				const data = response.data;
				if (data.status === "error") { alert(`Error: ${data.error}`); }
				else { alert(`Status: ${data.status}`); }
			});
	};

	return (
		<section>
			<h2>{strings["upload"]}</h2>
			<form onSubmit={handlePhoto} autoComplete="off" enctype="multipart/form-data">
				<input
					type="file"
					onChange={handleChange}
				/>
				<br/>
				<button>{strings["upload"]}</button>
			</form>
		</section>
	);
};


export default Photo;
