import "../../css/maps.css";
import { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { api } from "../../api/api";
import { Box, Button, Center, Flex, Grid } from "@chakra-ui/react";

export default function Maps({ geolocation }) {
	const [warehouse, setWarehouse] = useState([]);
	const [selectedMarker, setSelectedMarker] = useState(null);

	useEffect(() => {
		getWarehouse();
	}, []);

	async function getWarehouse() {
		const res = await api().get("/warehouse");
		setWarehouse(res.data);
	}
	const center = useMemo(() => ({ lat: -6.2094, lng: 106.8269 }), []);

	return (
		<>
			<Center fontWeight={700} fontSize={"4xl"} pt={"15px"}>
				All Offline Store
			</Center>
			<Center
				flexWrap={"wrap"}
				pb={"20px"}
				gap={"20px"}
				padding={"40px"}
				margin={"15px 40px 30px"}
				border={"1px"}
				borderRadius={"15px"}
				borderColor={"#E6EBF2"}
				boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
			>
				<Box className="map-container">
					<GoogleMap
						zoom={!geolocation ? 5 : 12}
						center={geolocation ? geolocation : center}
						mapContainerClassName="map"
					>
						{selectedMarker && geolocation && (
							<Button
								style={{
									position: "absolute",
									top: "10px",
									left: "10px",
									zIndex: 1,
								}}
								onClick={() =>
									window.open(
										`https://www.google.com/maps/dir/${geolocation.lat},${geolocation.lng}/${selectedMarker.latitude},${selectedMarker.longitude}`,
										"_blank"
									)
								}
							>
								Get Directions
							</Button>
						)}
						{warehouse.length
							? warehouse?.map((val) => (
									<Marker
										key={val.id}
										position={{
											lat: parseFloat(val?.latitude),
											lng: parseFloat(val?.longitude),
										}}
										icon={{
											url: "https://cdn-icons-png.flaticon.com/512/7561/7561255.png",
											scaledSize: new window.google.maps.Size(40, 40),
										}}
										onClick={() => setSelectedMarker(val)}
									/>
							  ))
							: null}
						<Marker
							position={geolocation}
							icon={{
								url: "https://cdn-icons-png.flaticon.com/512/4151/4151073.png",
								scaledSize: new window.google.maps.Size(40, 40),
							}}
						/>
					</GoogleMap>
				</Box>
				<Box
					border={"1px"}
					p={"15px"}
					borderRadius={"15px"}
					borderColor={"#E6EBF2"}
					boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
					maxHeight="600px"
					overflowY="auto"
					over
				>
					<Center fontWeight={700} fontSize={"2xl"} pb={"20px"}>
						Store Address
					</Center>
					<Grid templateColumns={"repeat(2, 1fr)"} gap={"10px"}>
						{warehouse?.length
							? warehouse?.map((val) => (
									<Box
										border={"1px"}
										borderRadius={"15px"}
										borderColor={"#E6EBF2"}
										boxShadow={
											selectedMarker === val
												? null
												: "0 2px 4px rgba(0, 0, 0, 0.4)"
										}
										w={"100%"}
										maxW={"350px"}
										padding={"10px"}
										color={selectedMarker === val ? "black" : ""}
										backgroundColor={selectedMarker === val ? "gray.300" : ""}
									>
										<Flex fontWeight={600}>{val?.warehouse_name}</Flex>
										<Flex>
											{val?.address}, {val?.district}, {val?.city},{" "}
											{val?.province}.
										</Flex>
										<Flex>{val?.phone_number} </Flex>
									</Box>
							  ))
							: null}
					</Grid>
				</Box>
			</Center>
		</>
	);
}
