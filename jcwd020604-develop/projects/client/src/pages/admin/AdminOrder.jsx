import React from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Box,
	Text,
	Stack,
	useToast,
	Badge,
	Flex,
	Image,
	HStack,
	Button,
	useDisclosure,
	Select,
	ButtonGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { api } from '../../api/api';
import Navbar from '../../components/Navbar';
import Footer from "../../components/Footer";
import OrderModal from "./OrderModal";
import OrderNotFound from "../redirect/OrderNotFound";

const AdminOrder = () => {
	const user = useSelector((state) => state.auth);
    const toast = useToast();
    const orderModal = useDisclosure();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [warehouse, setWarehouse] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        fetchData();
    }, [selectedStatus, selectedWarehouse, page]);

	useEffect(() => {
		fetchData();
	}, [selectedStatus, selectedWarehouse, page]);

	useEffect(() => {
		getWarehouse();
	}, []);

	useEffect(() => {
		if (user.role !== "ADMIN") {
			setSelectedWarehouse(user.warehouse_id);
		}
	}, []);

    const fetchData = async () => {
        try {
          const response = await api().get(`/orders/orders`, {
            params: {
              status: selectedStatus,
              warehouse_id: selectedWarehouse,
              page: page,
            },
          });
          const { rows, count } = response.data;
          setOrders(rows);
          setTotalPage(Math.ceil(count / 3));
        } catch (error) {
		  toast({
			title: "An error occurred while fetching data.",
			status: "error",
			position: "top",
			duration: 3000,
			isClosable: false,
		});
        }
      };
      
    const sendOrder = async (orderId) => {
        try {
            await api().patch(`/action-order/orders/sending-order/${orderId}`, {
                send: "send",
            });
            toast({
                title: "Sending order to user",
                status: "success",
                position: "top",
                duration: 3000,
                isClosable: false,
            });
            fetchData();
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: false,
            });
        }
    };

	const cancelOrder = async (orderId) => {
		try {
			await api().patch(`/action-order/orders/sending-order/${orderId}`, {
				send: "cancel",
			});
			toast({
				title: "Order cancelled",
				status: "error",
				position: "top",
				duration: 3000,
				isClosable: false,
			});
			fetchData();
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				position: "top",
				duration: 3000,
				isClosable: false,
			});
		}
	};

	async function getWarehouse() {
		const res = await api().get("/warehouse");
		setWarehouse(res.data);
	}

	const handlePageChange = (newPage) => {
		if (newPage !== page) {
			setPage(newPage);
		}
	};

	return (
		<>
			<Navbar />
			<>
				<Flex flexDir={"row"} mx={{ base: "10", sm: "6", md: "14" }}>
					<Select
						placeholder="All Status"
						w={{ base: "none", sm: "md", md: "13%" }}
						m={4}
						cursor={"pointer"}
						fontSize={"xs"}
						variant="unstyled"
						value={selectedStatus}
						onChange={(event) => {
							setPage(1);
							setSelectedStatus(event.target.value);
						}}
					>
						<option>DONE</option>
						<option>CANCELLED</option>
						<option value={"WAITING_PAYMENT"}>WAITING PAYMENT</option>
						<option value={"WAITING_STOCK_TRANSFER"}>WAITING STOCK</option>
						<option>PAYMENT</option>
						<option>DELIVERY</option>
						<option>PROCESSING</option>
					</Select>
					{user.role === "ADMIN" ? (
						<Select
							placeholder="All Warehouse"
							w={{ base: "none", sm: "md", md: "12%" }}
							m={4}
							cursor={"pointer"}
							fontSize={"xs"}
							variant="unstyled"
							value={selectedWarehouse}
							onChange={(event) => {
								setPage(1);
								setSelectedWarehouse(event.target.value);
							}}
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
							placeholder="All Warehouse"
							w={{ base: "none", sm: "md", md: "12%" }}
							m={4}
							cursor={"pointer"}
							fontSize={"xs"}
							variant="unstyled"
							value={selectedWarehouse}
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
				</Flex>
				{orders?.length === 0 ? (
					<OrderNotFound />
				) : (
					<>
						{orders?.length ? orders?.map((order) => (
							<Card
								my={2}
								mx={{ base: "10", sm: "6", md: "14" }}
								size={"sm"}
								display={"block"}
								position={"relative"}
								bgColor={"white"}
							>
								<CardHeader key={order.id}>
									<Stack
										direction={"row"}
										px={1}
										display={"flex"}
										align={"center"}
										justifyContent={"flex-end"}
									>
										<Badge
											variant="solid"
											colorScheme={
												order.status === "CANCELLED"
													? "red"
													: order.status === "PAYMENT"
													? "blue"
													: order.status === "WAITING_PAYMENT"
													? "purple"
													: order.status === "WAITING_STOCK_TRANSFER"
													? "orange"
													: order.status === "DELIVERY"
													? "blue"
													: order.status === "PROCESSING"
													? "teal"
													: "green"
											}
										>
											{order.status}
										</Badge>
										<Text
											fontSize={"sm"}
											fontWeight={"medium"}
											textColor={"blackAlpha.600"}
										>
											No {order.invoice}
										</Text>
									</Stack>
								</CardHeader>
								<CardBody>
									<Flex align={"flex-start"} justifyContent={"flex-start"}>
										<Text
											fontSize={"xs"}
											px={1}
											bgColor={"blackAlpha.100"}
											fontWeight={"bold"}
											textColor={"blackAlpha.600"}
										>
											{order.user?.fullname}
										</Text>
									</Flex>
									{order.order_details?.length ? order.order_details.map((detail) => (
										<Box key={detail.id}>
											<Flex flexDir={{base: 'column', md: 'row', sm: 'column'}}>
												<Image
													src={`${process.env.REACT_APP_API_BASE_URL}/${detail?.stock?.product?.product_images[0]?.product_image}`}
													w={"100%"}
													boxSize="250px"
													objectFit="cover"
												></Image>
												<Stack spacing={"3"}>
													<Text
														fontSize={"sm"}
														fontWeight={"bold"}
														textColor={"blackAlpha.600"}
													>
														{detail.stock?.product?.product_name}
													</Text>
													<Flex w={{ base: "100%", sm: "100%", md: "50%" }}>
														<Text
															textAlign={'justify'}
															as={"p"}
															fontSize={"sm"}
															fontWeight={"semibold"}
															textColor={"blackAlpha.600"}
														>
															{detail.stock?.product?.product_detail}
														</Text>
													</Flex>
													<Text
														fontSize={"sm"}
														fontWeight={"normal"}
														textColor={"blackAlpha.600"}
													>
														{detail.qty} barang x Rp{detail.price}
													</Text>
												</Stack>
											</Flex>
											<Flex justifyContent={"space-between"}>
												<Flex></Flex>
												{order.status === "PROCESSING" ? (
													<>
														<Flex gap={"10px"}>
															<Button
																display={"flex"}
																size={'xs'}
																justifyContent={"end"}
																colorScheme="red"
																onClick={() => cancelOrder(order.id)}
															>
																Cancel
															</Button>
															<Button
																display={"flex"}
																size={'xs'}
																justifyContent={"end"}
																colorScheme="green"
																onClick={() => sendOrder(order.id)}
															>
																Send
															</Button>
														</Flex>
													</>
												) : (
													<Button
														display={"flex"}
														justifyContent={{
															base: "flex-start",
															sm: "flex-start",
															md: "flex-end",
														}}
														colorScheme="green"
														size={"xs"}
														variant={"link"}
														onClick={() => {
															orderModal.onOpen();
															setSelectedOrder(order.id);
														}}
													>
														Show Detail Order
													</Button>
												)}
											</Flex>
										</Box>
									)): null}
								</CardBody>
							</Card>
						)): null}
					</>
				)}
			</>
			<OrderModal
				isOpen={orderModal.isOpen}
				onClose={orderModal.onClose}
				fetchData={fetchData}
				orders={orders}
				selectedOrder={selectedOrder}
				setSelectedOrder={setSelectedOrder}
			/>
			<ButtonGroup
				p={3}
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				size={"xs"}
				colorScheme={"cyan"}
			>
				{page === 1 || orders?.length === 0 ? null : (
					<Button
						onClick={() => {
							handlePageChange(page - 1);
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
					>
						Previous
					</Button>
				)}
				{page === totalPage || orders?.length === 0 ? null : (
					<Button
						onClick={() => {
							handlePageChange(page + 1);
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
					>
						Next
					</Button>
				)}
			</ButtonGroup>
			<Footer />
		</>
	);
};

export default AdminOrder;
