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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCategoryModal({ isOpen, onClose, getCategory }) {
	const toast = useToast();
	const nav = useNavigate();

	const formik = useFormik({
		initialValues: {
			category_name: "",
		},
		validationSchema: Yup.object().shape({
			category_name: Yup.string().required(),
		}),
		onSubmit: async () => {
			try {
				const { category_name } = formik.values;
				if (formik.isValid) {
					const res = await api().post("/category", formik.values);
					toast({
						title: `Add Category Success`,
						description: "The category has been added successfully.",
						status: "success",
						position: "top",
						duration: 3000,
					});
					getCategory();
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
				<ModalHeader>Add Category</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl>
						<FormLabel>Category Name:</FormLabel>
						<Input
							placeholder="e.g. TOPS"
							id="category_name"
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
						Add Category
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
