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
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsFillCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useSelector } from "react-redux";
import DeleteStockModal from "./DeleteStockModal";
import EditStockModal from "./EditStockModal";

export default function StockCard({ val, getStock }) {
	const user = useSelector((state) => state.auth);
	const stock = val.qty;
	const deleteStockModal = useDisclosure();
	const editStockModal = useDisclosure();
	const toast = useToast();
	const nav = useNavigate();

	async function deleteStock() {
		try {
			await api().delete(`/stock/${val.id}`);

			toast({
				title: "Stock Deleted",
				description: "The stock has been deleted successfully.",
				status: "success",
				position: "top",
				duration: 3000,
			});
			getStock();
			deleteStockModal.onClose();
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
	return (
		<>
			<Card
				maxW="xs"
				_hover={{
					backgroundColor: "#E6EBF2",
				}}
			>
				<CardBody>
					<Image
						src={
							`${process.env.REACT_APP_API_BASE_URL}/${val.product.product_images[0]}`
								? `${process.env.REACT_APP_API_BASE_URL}/${val.product.product_images[0].product_image}`
								: null
						}
						borderRadius="lg"
					/>
					<Stack mt="6" spacing="2">
						<Flex>
							<Heading size="md">{val.product.product_name}</Heading>
							<Menu>
								<MenuButton w={"25px"} h={"25px"} cursor={"pointer"}>
									<Icon as={BiDotsVerticalRounded} />{" "}
								</MenuButton>
								<MenuList>
									<MenuItem onClick={editStockModal.onOpen} getStock={getStock}>
										Edit
									</MenuItem>
									{user.role === "ADMIN" ? (
										<MenuItem onClick={deleteStockModal.onOpen} color={"red"}>
											Remove
										</MenuItem>
									) : null}
								</MenuList>
							</Menu>
						</Flex>
						<Flex flexDir={"column"}>
							<Flex w={"190px"}>
								{!val?.warehouse ? (
									<Flex>Undefined warehouse</Flex>
								) : (
									val?.warehouse?.warehouse_name
								)}
							</Flex>
							<Flex w={"190px"}>
								{val.product.category == null ? (
									<Flex>Category not found</Flex>
								) : (
									val.product.category.category_name
								)}
							</Flex>
							<Flex w={"190px"} alignItems={"center"} gap={"5px"}>
								Stock: {val.qty}{" "}
								{stock > 10 ? (
									<Flex>
										<Icon as={BsFillCircleFill} color={"green"} />
									</Flex>
								) : stock > 0 ? (
									<Flex>
										<Icon as={BsFillCircleFill} color={"orange"} />
									</Flex>
								) : (
									<Flex>
										<Icon as={BsFillCircleFill} color={"red"} />
									</Flex>
								)}
							</Flex>
						</Flex>
					</Stack>
				</CardBody>
				<EditStockModal
					isOpen={editStockModal.isOpen}
					onClose={editStockModal.onClose}
					val={val}
					getStock={getStock}
				/>
				<DeleteStockModal
					isOpen={deleteStockModal.isOpen}
					onClose={deleteStockModal.onClose}
					deleteStock={deleteStock}
				/>
			</Card>
		</>
	);
}
