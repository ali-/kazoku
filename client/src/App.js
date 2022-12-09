import React from "react";
import Register from "./Register";

function App() {
	const [data, setData] = React.useState(null);

	React.useEffect(() => {
		fetch("/api")
			.then((res) => res.json())
			.then((data) => setData(data.message));
	}, []);

	return (
		<main className="App">
			<Register/>
		</main>
	);
}

export default App;
