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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddWarehouseModal({ isOpen, onClose, getWarehouse }) {
	const [city, setCity] = useState([]);
	const [province, setProvince] = useState([]);
	const [selectedProvince, setSelectedProvince] = useState("");
	const toast = useToast();
	const nav = useNavigate();

	useEffect(() => {
		getAllProvince();
		getAllCity();
	}, [isOpen]);

	const formik = useFormik({
		initialValues: {
			warehouse_name: "",
			address: "",
			province: "",
			city: "",
			city_id: "",
			district: "",
			phone_number: "",
		},
		validationSchema: Yup.object().shape({
			warehouse_name: Yup.string().required(),
			address: Yup.string().required(),
			province: Yup.string().required(),
			city: Yup.string().required(),
			city_id: Yup.number().required(),
			district: Yup.string().required(),
			phone_number: Yup.string().required(),
		}),
		onSubmit: async () => {
			try {
				const {
					warehouse_name,
					address,
					province,
					city,
					city_id,
					district,
					phone_number,
				} = formik.values;
				if (formik.isValid) {
					const res = await api().post("/warehouse", formik.values);
					toast({
						title: `Add Warehouse Success`,
						description: "The warehouse has been added successfully.",
						status: "success",
						position: "top",
						duration: 3000,
					});
					getWarehouse();
					handleModalClose();
					nav("/admin/managedata");
				}
			} catch (error) {
				toast({
					title: error.response.data.message,
					status: "error",
					position: "top",
					duration: 3000,
				});
			}
		},
	});

	async function getAllProvince() {
		const res = await api().get("/warehouse/getAll/province");
		setProvince(res.data);
	}

	async function getAllCity() {
		const res = await api().get("/warehouse/getAll/city");
		setCity(res.data);
	}

	async function inputHandler(event) {
		const { value, id } = event.target;

		if (id === "city") {
			const [selectedCityName, selectedCityId] = value.split("|");
			formik.setFieldValue("city", selectedCityName);
			formik.setFieldValue("city_id", selectedCityId);
		} else {
			formik.setFieldValue(id, value);
		}
	}

	const isAddButtonEnabled = formik.dirty && formik.isValid;

	const handleModalClose = () => {
		formik.resetForm();
		onClose();
		setSelectedProvince("");
	};

	return (
		<Modal isOpen={isOpen} onClose={handleModalClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Warehouse</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl>
						<FormLabel>Warehouse Name:</FormLabel>
						<Input
							placeholder="e.g. MMS Jogja"
							id="warehouse_name"
							onChange={inputHandler}
						/>
						<FormLabel>Address:</FormLabel>
						<Input
							placeholder="e.g. Jalan Malioboro"
							id="address"
							onChange={inputHandler}
						/>
						<FormLabel>District:</FormLabel>
						<Input
							placeholder="e.g. Gedongtengen "
							id="district"
							onChange={inputHandler}
						/>
						<FormLabel>Province:</FormLabel>
						<Select
							placeholder="Choose Province"
							id="province"
							onChange={(event) => {
								inputHandler(event); // Call the inputHandler function to update the formik values
								setSelectedProvince(event.target.value); // Update the selected province
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
							placeholder="Choose City"
							id="city"
							onChange={inputHandler}
							disabled={!selectedProvince} // Disable the city select until a province is selected
						>
							{city.length
								? city
										.filter((val) => val.province === selectedProvince)
										.map((val) => (
											<option
												key={val.id}
												value={`${val.city_name}|${val.city_id}`}
											>
												{val.city_name}
											</option>
										))
								: null}
						</Select>
						<FormLabel>Phone Number:</FormLabel>
						<Input
							placeholder="08.."
							id="phone_number"
							type="number"
							onChange={inputHandler}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button
						onClick={formik.handleSubmit}
						colorScheme="green"
						mr={3}
						isDisabled={!isAddButtonEnabled}
					>
						Add Warehouse
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
