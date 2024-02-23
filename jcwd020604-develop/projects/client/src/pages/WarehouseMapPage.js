import { useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import "../css/maps.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Maps from "../components/warehouse/WarehouseMap";

export default function WarehouseMap() {
	const [geolocation, setGeolocation] = useState(null);

	useEffect(() => {
		geo();
	}, []);

	function geo() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;
					setGeolocation({ lat: latitude, lng: longitude });
				},
				function (error) {
					console.error("Error getting geolocation:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}

	const { isLoaded } = useLoadScript({
		// googleMapsApiKey: `${process.env.GOOGLE_MAPS_API_KEY}`,
	});

	if (isLoaded) {
		return (
			<>
				<Navbar />
				<Maps geolocation={geolocation} />
				<Footer />
			</>
		);
	}
}
