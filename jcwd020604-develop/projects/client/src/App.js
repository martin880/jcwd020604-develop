import "./App.css";
import { useEffect, useState } from "react";
import { Routes } from "react-router-dom";
import routes from "./routes/Routes";
import Loading from "./components/Loading";

function App() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [isLoading]);

	return (
		<>{isLoading ? <Loading /> : <Routes>{routes.map((val) => val)}</Routes>}</>
	);
}

export default App;
