import {
	Flex,
	Icon,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useToast,
	useDisclosure,
	Card,
	CardBody,
	Stack,
	Heading,
} from "@chakra-ui/react";
import moment from "moment";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import DeleteMutationModal from "./DeleteMutationModal";
import EditMutationModal from "./EditMutationModal";

export default function MutationCard({ val, getMutation, getRequest }) {
	const deleteMutationModal = useDisclosure();
	const editMutationModal = useDisclosure();
	const toast = useToast();
	const nav = useNavigate();

	async function deleteMutation() {
		try {
			await api().delete(`/stockmutation/${val.id}`);

			toast({
				title: "Mutation Deleted",
				description: "The mutation has been deleted successfully.",
				status: "success",
				position: "top",
				duration: 3000,
			});
			getMutation();
			getRequest();
			deleteMutationModal.onClose();
			nav("/admin/mutation");
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				position: "top",
				duration: 3000,
			});
		}
	}
	return (
		<>
			{val?.stock?.id ? (
				<Card
					maxW="xs"
					_hover={{
						backgroundColor: "#E6EBF2",
					}}
				>
					<CardBody>
						<Image
							src={
								`${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.product?.product_images[0]}`
									? `${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.product?.product_images[0]?.product_image}`
									: null
							}
							borderRadius="lg"
						/>
						<Stack mt="6" spacing="2">
							<Flex justifyContent={"space-between"}>
								<Heading size="md">{val?.stock?.product?.product_name}</Heading>
								{val?.status === "PENDING" ? (
									<Menu>
										<MenuButton w={"25px"} h={"25px"} cursor={"pointer"}>
											<Icon as={BiDotsVerticalRounded} />
										</MenuButton>
										<MenuList>
											<MenuItem onClick={editMutationModal.onOpen}>
												Edit
											</MenuItem>
											<MenuItem
												onClick={deleteMutationModal.onOpen}
												color={"red"}
											>
												Cancel
											</MenuItem>
										</MenuList>
									</Menu>
								) : val?.status === "APPROVED" ? (
									<Icon
										w={"20px"}
										h={"20px"}
										color={"green"}
										as={AiOutlineCheckCircle}
									/>
								) : val?.status === "AUTO" ? (
									<Icon
										w={"20px"}
										h={"20px"}
										color={"green"}
										as={AiOutlineCheckCircle}
									/>
								) : (
									<Icon
										w={"20px"}
										h={"20px"}
										color={"red"}
										as={AiOutlineCloseCircle}
									/>
								)}
							</Flex>
							<Flex flexDir={"column"}>
								<Flex w={"100px"}>{val?.status}</Flex>
								<Flex w={"100px"}>Amount: {val?.qty}</Flex>
								<Flex w={"195px"}>
									{`${
										val?.from_warehouse?.warehouse_name
											? val?.from_warehouse?.warehouse_name
											: "Undefined warehouse"
									} ➜ ${
										val?.to_warehouse?.warehouse_name
											? val?.to_warehouse?.warehouse_name
											: "Undefined warehouse"
									}`}
								</Flex>
								<Flex w={"195px"}>{val?.mutation_code}</Flex>
								<Flex w={"170px"}>
									{moment(val?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
								</Flex>
							</Flex>
						</Stack>
					</CardBody>
					<EditMutationModal
						isOpen={editMutationModal.isOpen}
						onClose={editMutationModal.onClose}
						val={val}
						getMutation={getMutation}
						getRequest={getRequest}
					/>
					<DeleteMutationModal
						isOpen={deleteMutationModal.isOpen}
						onClose={deleteMutationModal.onClose}
						deleteMutation={deleteMutation}
					/>
				</Card>
			) : null}
		</>
	);
}
