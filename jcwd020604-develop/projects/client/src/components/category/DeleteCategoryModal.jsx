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

export default function DeleteCategoryModal({ isOpen, onClose }) {
	const [category, setCategory] = useState([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [confirmationText, setConfirmationText] = useState("");
	const toast = useToast();
	const nav = useNavigate();

	useEffect(() => {
		getCategory();
	}, [isOpen]);

	useEffect(() => {
		// Reset the state when the modal is closed
		if (!isOpen) {
			setSelectedCategoryId("");
			setConfirmationText("");
		}
	}, [isOpen]);

	async function getCategory() {
		const res = await api().get("/category");
		setCategory(res.data);
	}

	async function deleteCategory(categoryId) {
		try {
			await api().delete(`/category/${categoryId}`);

			toast({
				title: "Category Deleted",
				description: "The category has been deleted successfully.",
				status: "success",
				position: "top",
				duration: 3000,
			});
			getCategory();
			onClose();
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

	const handleCategorySelect = (event) => {
		setSelectedCategoryId(event.target.value);
	};

	const handleConfirmationTextChange = (event) => {
		setConfirmationText(event.target.value);
	};

	const isDeleteButtonEnabled =
		selectedCategoryId !== "" && confirmationText.trim() === "DELETE";

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete Category</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl>
						<FormLabel>Select Category:</FormLabel>
						<Select
							placeholder="Select Category"
							id="category"
							value={selectedCategoryId}
							onChange={handleCategorySelect}
						>
							{category.length
								? category.map((val) => (
										<option key={val.id} value={val.id}>
											{val.category_name}
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
								deleteCategory(selectedCategoryId);
							}
						}}
						isDisabled={!isDeleteButtonEnabled}
					>
						Delete Category
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
