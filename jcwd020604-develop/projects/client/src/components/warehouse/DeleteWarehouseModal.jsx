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

export default function DeleteWarehouseModal({ isOpen, onClose }) {
	const [warehouse, setWarehouse] = useState([]);
	const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
	const [confirmationText, setConfirmationText] = useState("");
	const toast = useToast();
	const nav = useNavigate();

	useEffect(() => {
		getWarehouse();
	}, [isOpen]);

	useEffect(() => {
		// Reset the state when the modal is closed
		if (!isOpen) {
			setSelectedWarehouseId("");
			setConfirmationText("");
		}
	}, [isOpen]);

	async function getWarehouse() {
		const res = await api().get("/warehouse");
		setWarehouse(res.data);
	}

	async function deleteWarehouse(warehouseId) {
		try {
			await api().delete(`/warehouse/${warehouseId}`);
			toast({
				title: "Warehouse Deleted",
				description: "The warehouse has been deleted successfully.",
				status: "success",
				position: "top",
				duration: 3000,
			});
			onClose();
			getWarehouse();
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

	const handleWarehouseSelect = (event) => {
		setSelectedWarehouseId(event.target.value);
	};

	const handleConfirmationTextChange = (event) => {
		setConfirmationText(event.target.value);
	};

	const isDeleteButtonEnabled =
		selectedWarehouseId !== "" && confirmationText.trim() === "DELETE";

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete Warehouse</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl>
						<FormLabel>Select Warehouse:</FormLabel>
						<Select
							placeholder="Select Warehouse"
							id="warehouse"
							value={selectedWarehouseId}
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
					</FormControl>
					<FormControl mt={4}>
						<FormLabel>Type "DELETE" to confirm:</FormLabel>
						<Input
							type="text"
							value={confirmationText}
							onChange={handleConfirmationTextChange}
							placeholder="Type 'DELETE' here"
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="red"
						mr={3}
						onClick={() => {
							if (isDeleteButtonEnabled) {
								deleteWarehouse(selectedWarehouseId);
							}
						}}
						isDisabled={!isDeleteButtonEnabled}
					>
						Delete Warehouse
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
