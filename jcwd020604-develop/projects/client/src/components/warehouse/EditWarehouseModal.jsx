import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	useToast,
	Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

export default function EditWarehouseModal({ isOpen, onClose }) {
	const [warehouse, setWarehouse] = useState([]);
	const [selectedWarehouse, setSelectedWarehouse] = useState(null);
	const [selectedProvince, setSelectedProvince] = useState("");
	const [data, setData] = useState({});
	const [city, setCity] = useState([]);
	const [province, setProvince] = useState([]);
	const toast = useToast();
	const nav = useNavigate();

	useEffect(() => {
		getWarehouse();
		getAllProvince();
		getAllCity();
	}, [isOpen]);

	useEffect(() => {
		getWarehouseById();
	}, [selectedWarehouse]);

	async function editWarehouse() {
		try {
			await api().patch(`/warehouse/${selectedWarehouse}`, data);
			toast({
				title: "Warehouse updated successfully.",
				status: "success",
				position: "top",
				duration: 3000,
				isClosable: true,
			});
			getWarehouse();
			handleModalClose();
			nav("/admin/managedata");
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				position: "top",
				duration: 3000,
			});
		}
	}

	async function getWarehouseById() {
		if (selectedWarehouse) {
			const res = await api().get(`/warehouse/${selectedWarehouse}`);
			setData(res.data);
		}
	}

	async function getWarehouse() {
		const res = await api().get("/warehouse");
		setWarehouse(res.data);
	}

	async function getAllProvince() {
		const res = await api().get("/warehouse/getAll/province");
		setProvince(res.data);
	}

	async function getAllCity() {
		const res = await api().get("/warehouse/getAll/city");
		setCity(res.data);
	}

	const handleWarehouseSelect = (event) => {
		setSelectedWarehouse(event.target.value);
	};

	const resetInputFields = () => {
		setData({});
		setSelectedWarehouse();
		setSelectedProvince("");
	};

	const handleModalClose = () => {
		resetInputFields();
		onClose();
	};
	const isSaveButtonEnabled = selectedWarehouse;

	return (
		<Modal isOpen={isOpen} onClose={handleModalClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Warehouse Detail</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl>
						<FormLabel>Select Warehouse:</FormLabel>
						<Select
							placeholder="Choose Warehouse"
							onChange={handleWarehouseSelect}
						>
							{warehouse.length
								? warehouse.map((val) => (
										<option key={val.id} value={val.id}>
											{val.warehouse_name}
										</option>
								  ))
								: null}
						</Select>
						<FormLabel>Warehouse Name:</FormLabel>
						<Input
							placeholder="e.g. MMS Jogja"
							id="warehouse_name"
							defaultValue={data.warehouse_name}
							isDisabled={!isSaveButtonEnabled}
							onChange={(e) =>
								setData({ ...data, warehouse_name: e.target.value })
							}
						/>
						<FormLabel>Address:</FormLabel>
						<Input
							placeholder="e.g. Jalan Malioboro"
							id="address"
							defaultValue={data.address}
							isDisabled={!isSaveButtonEnabled}
							onChange={(e) => setData({ ...data, address: e.target.value })}
						/>
						<FormLabel>District:</FormLabel>
						<Input
							placeholder="e.g. Gedongtengen "
							id="district"
							defaultValue={data.district}
							isDisabled={!isSaveButtonEnabled}
							onChange={(e) => setData({ ...data, district: e.target.value })}
						/>
						<FormLabel>Province:</FormLabel>
						<Select
							id="province"
							value={data.province}
							placeholder="Choose Province"
							isDisabled={!isSaveButtonEnabled}
							onChange={(e) => {
								setData({ ...data, province: e.target.value });
								setSelectedProvince(e.target.value);
							}}
						>
							{province.length
								? province.map((val) => (
										<option key={val.id} value={val.id}>
											{val.province}
										</option>
								  ))
								: null}
						</Select>
						<FormLabel>City:</FormLabel>
						<Select
							id="city"
							placeholder="Choose City"
							isDisabled={!isSaveButtonEnabled}
							onChange={(e) => {
								const [cityName, cityId] = e.target.value.split("|");
								setData({ ...data, city: cityName, city_id: cityId });
							}}
						>
							{city &&
								city
									.filter((val) => val.province === data.province)
									.map((val) =>
										data.city != val.city_name ? (
											<option
												key={val.city_id}
												value={`${val.city_name}|${val.city_id}`}
											>
												{val.city_name}
											</option>
										) : (
											<option
												selected
												key={val.city_id}
												value={`${val.city_name}|${val.city_id}`}
											>
												{val.city_name}
											</option>
										)
									)}
						</Select>
						<FormLabel>Phone Number:</FormLabel>
						<Input
							placeholder="08.. "
							type="number"
							id="phone_number"
							defaultValue={data.phone_number}
							isDisabled={!isSaveButtonEnabled}
							onChange={(e) =>
								setData({ ...data, phone_number: e.target.value })
							}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button
						onClick={editWarehouse}
						colorScheme="blue"
						mr={3}
						isDisabled={!isSaveButtonEnabled}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
