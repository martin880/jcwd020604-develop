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
	Select,
	HStack,
	Center,
	useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";

export default function AddStockModal({ isOpen, onClose, getStock }) {
	const user = useSelector((state) => state.auth);
	const toast = useToast();
	const nav = useNavigate();
	const [product, setProduct] = useState([]);
	const [warehouse, setWarehouse] = useState([]);

	useEffect(() => {
		getWarehouse();
		getAllProduct();
	}, [isOpen]);

	const formik = useFormik({
		initialValues: {
			qty: "",
			warehouse_id: user.role === "ADMIN" ? "" : user.warehouse_id,
			product_id: "",
		},
		validationSchema: Yup.object().shape({
			qty: Yup.number().min(0).required(),
			warehouse_id: Yup.number().required(),
			product_id: Yup.number().required(),
		}),
		onSubmit: async () => {
			try {
				const { qty, warehouse_id, product_id } = formik.values;
				if (formik.isValid) {
					const res = await api().post("/stock", formik.values);
					toast({
						title: `Add Stock Success`,
						description: "The stock has been added successfully.",
						status: "success",
						position: "top",
						duration: 3000,
					});
					getStock();
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

	async function getAllProduct() {
		const res = await api().get("/product/getAllProduct/getAll");
		setProduct(res.data);
	}

	async function getWarehouse() {
		const res = await api().get("/warehouse");
		setWarehouse(res.data);
	}

	async function inputHandler(event) {
		const { value, id } = event.target;
		formik.setFieldValue(id, value);
	}

	const isAddButtonEnabled = formik.dirty && formik.isValid;

	const handleModalClose = () => {
		formik.resetForm();
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleModalClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Stock</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl w={"100%"}>
						<FormLabel>Select Warehouse:</FormLabel>
						{user.role === "ADMIN" ? (
							<Select
								placeholder="All Warehouses"
								id="warehouse_id"
								onChange={inputHandler}
							>
								{warehouse.length
									? warehouse.map((val) => (
											<option key={val.id} value={val.id}>
												{val.warehouse_name}
											</option>
									  ))
									: null}
							</Select>
						) : (
							<Select
								placeholder="All Warehouses"
								id="warehouse_id"
								defaultValue={user.warehouse_id}
								isDisabled
							>
								{warehouse.length
									? warehouse.map((val) => (
											<option key={val.id} value={val.id}>
												{val.warehouse_name}
											</option>
									  ))
									: null}
							</Select>
						)}
						<FormLabel>Select Product:</FormLabel>
						<Select
							placeholder="All Product"
							id="product_id"
							onChange={inputHandler}
						>
							{product.length
								? product.map((val) => (
										<option key={val.id} value={val.id}>
											{val.product_name}
										</option>
								  ))
								: null}
						</Select>
						<Center flexDir={"column"} pt={"15px"}>
							<FormLabel pl={"18px"}>Stock Amount:</FormLabel>
							<HStack w="100px">
								<Input
									textAlign={"center"}
									placeholder="0"
									type="number"
									id="qty"
									onChange={inputHandler}
								/>
							</HStack>
						</Center>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="green"
						mr={3}
						onClick={formik.handleSubmit}
						isDisabled={!isAddButtonEnabled}
					>
						Add Stock
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
