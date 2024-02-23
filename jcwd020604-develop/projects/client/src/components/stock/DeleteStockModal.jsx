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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function DeleteStockModal({ isOpen, onClose, deleteStock }) {
	const [confirmationText, setConfirmationText] = useState("");

	useEffect(() => {
		if (!isOpen) {
			setConfirmationText("");
		}
	}, [isOpen]);

	const handleConfirmationTextChange = (event) => {
		setConfirmationText(event.target.value);
	};

	const isDeleteButtonEnabled = confirmationText.trim() === "DELETE";

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				onClose();
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete Stock</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
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
						isDisabled={!isDeleteButtonEnabled}
						onClick={deleteStock}
					>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
