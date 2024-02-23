import {
	Center,
	Flex,
	Select,
	InputGroup,
	Input,
	InputRightElement,
	Icon,
	Button,
	useDisclosure,
	Grid,
} from "@chakra-ui/react";
import { HamburgerIcon, RepeatIcon, TimeIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { BsFillCircleFill } from "react-icons/bs";
import { FaBoxes, FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import AddCategoryModal from "../category/AddCategoryModal";
import AddWarehouseModal from "../warehouse/AddWarehouseModal";
import DeleteCategoryModal from "../category/DeleteCategoryModal";
import DeleteWarehouseModal from "../warehouse/DeleteWarehouseModal";
import EditWarehouseModal from "../warehouse/EditWarehouseModal";
import EditCategoryModal from "../category/EditCategoryModal";
import AddStockModal from "./AddStockModal";
import StockList from "./StockList";
import StockCard from "./CardStock";
import ButtonPage from "../ButtonPage";
import SortStock from "./SortStock";
import ButtonData from "./ButtonData";

export default function AdminManageData() {
	const [warehouse, setWarehouse] = useState([]);
	const [category, setCategory] = useState([]);
	const [stock, setStock] = useState([]);
	const [selectedWarehouse, setSelectedWarehouse] = useState("");
	const [selectedProduct, setSelectedProduct] = useState("");
	const [sort, setSort] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const [product, setProduct] = useState([]);
	const user = useSelector((state) => state.auth);
	const inputFileRef = useRef(null);

	const addStockModal = useDisclosure();
	const addCategoryModal = useDisclosure();
	const editCategoryModal = useDisclosure();
	const deleteCategoryModal = useDisclosure();
	const addWarehouseModal = useDisclosure();
	const editWarehouseModal = useDisclosure();
	const deleteWarehouseModal = useDisclosure();

	useEffect(() => {
		getCategory();
		getWarehouse();
		getAllProduct();
	}, []);

	useEffect(() => {
		getStock();
	}, [selectedWarehouse, selectedProduct, sort, search, page]);

	useEffect(() => {
		if (user.role !== "ADMIN") {
			setPage(1);
			setSelectedWarehouse(user.warehouse_id);
		}
	}, []);

	async function getStock() {
		const res = await api().get("/stock", {
			params: {
				warehouse_id:
					user.role === "ADMIN" ? selectedWarehouse : user.warehouse_id,
				product_id: selectedProduct,
				sort: sort,
				search: search,
				page: page,
			},
		});
		setStock(res.data.rows);
		setTotalPage(Math.ceil(res.data.count / 12));
	}

	async function getAllProduct() {
		const res = await api().get("/product/getAllProduct/getAll");
		setProduct(res.data);
	}

	async function getCategory() {
		const res = await api().get("/category");
		setCategory(res.data);
	}

	async function getWarehouse() {
		const res = await api().get("/warehouse");
		setWarehouse(res.data);
	}

	const handleSortChange = (sortOrder) => {
		if (sortOrder === sort) {
			setSort(
				sortOrder.includes("Asc")
					? sortOrder.replace("Asc", "Desc")
					: sortOrder.replace("Desc", "Asc")
			);
		} else {
			setSort(sortOrder);
		}
		setPage(1);
	};

	const handlePageChange = (newPage) => {
		if (newPage !== page) {
			setPage(newPage);
		}
	};

	const handleReset = () => {
		getStock();
		getAllProduct();
		getCategory();
		getWarehouse();
		setSelectedProduct("");
		setSelectedWarehouse(user.role === "ADMIN" ? "" : user.warehouse_id);
		setSort("");
		setSearch("");
		setPage(1);
	};

	// Grid Wrap
	const [pageWidth, setPageWidth] = useState(window.innerWidth);

	useEffect(() => {
		// Update the page width on window resize
		const handleResize = () => {
			setPageWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		// Clean up the event listener
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	let templateColumns;

	if (pageWidth <= 700) {
		templateColumns = "repeat(2, 1fr)";
	} else {
		templateColumns = "repeat(3, 1fr)";
	}

	let stockListOrGrid;

	if (pageWidth <= 900) {
		stockListOrGrid = (
			<Grid padding={"20px"} templateColumns={templateColumns} gap={"25px"}>
				{stock?.length ? (
					stock.map((val) => {
						return <StockCard val={val} getStock={getStock} />;
					})
				) : (
					<Center pt={"20px"} fontWeight={700}>
						Stock is empty
					</Center>
				)}
			</Grid>
		);
	} else {
		stockListOrGrid = (
			<>
				{stock.length ? (
					stock.map((val) => {
						return <StockList val={val} getStock={getStock} />;
					})
				) : (
					<Center pt={"20px"} fontWeight={700}>
						Stock is empty
					</Center>
				)}
			</>
		);
	}

	return (
		<>
			<Center flexDir={"column"}>
				<Flex
					margin={"30px 20px 30px"}
					border={"1px"}
					borderRadius={"15px"}
					borderColor={"#E6EBF2"}
					padding={"15px"}
					maxW={"1300px"}
					w={"100%"}
					justifyContent={"center"}
					flexDir={"column"}
				>
					<Flex flexDir={"column"} paddingBottom={"15px"}>
						<Flex fontWeight={600} paddingBottom={"15px"} fontSize={"23px"}>
							Manage Data
						</Flex>
						<Flex
							justifyContent={"space-between"}
							gap={"15px"}
							paddingBottom={"15px"}
							w={["100%", null, "auto"]} // Adjust width based on breakpoints
							flexWrap={["wrap", null, "nowrap"]}
						>
							<Flex gap={"15px"} justifyContent={"space-between"} w={"100%"}>
								<Flex gap={"15px"} w={"100%"}>
									<Button colorScheme="green" onClick={addStockModal.onOpen}>
										Add Stock
									</Button>
									<ButtonData
										user={user}
										button={Button}
										addCategoryModal={addCategoryModal}
										addWarehouseModal={addWarehouseModal}
										editCategoryModal={editCategoryModal}
										editWarehouseModal={editWarehouseModal}
										deleteCategoryModal={deleteCategoryModal}
										deleteWarehouseModal={deleteWarehouseModal}
									/>
								</Flex>
								<Button onClick={handleReset}>
									<RepeatIcon />
								</Button>
							</Flex>
							<Flex
								gap={"15px"}
								w={["100%", null, "auto"]}
								flexWrap={["wrap", null, "nowrap"]}
							>
								<Link to={`/admin/product`}>
									<Button gap={"5px"}>
										<HamburgerIcon /> Product Data
									</Button>
								</Link>
								<Link to={`/admin/mutation`}>
									<Button gap={"5px"}>
										<Icon as={FaBoxes} /> Stock Mutation
									</Button>
								</Link>
								<Link to={`/admin/stockhistory`}>
									<Button gap={"5px"}>
										<TimeIcon /> Stock History
									</Button>
								</Link>
							</Flex>
						</Flex>
						<Center
							gap={"15px"}
							paddingBottom={"15px"}
							w={["100%", null, "auto"]} // Adjust width based on breakpoints
							flexWrap={["wrap", null, "nowrap"]}
						>
							<Select
								placeholder="All Type of Products"
								value={selectedProduct}
								onChange={(event) => {
									setPage(1);
									setSelectedProduct(event.target.value);
								}}
							>
								{product.length
									? product.map((val) => (
											<option key={val.id} value={val.id}>
												{val.product_name}
											</option>
									  ))
									: null}
							</Select>
							{user.role === "ADMIN" ? (
								<Select
									placeholder="All Warehouses"
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
								<Select value={user.warehouse_id} isDisabled>
									{warehouse.length
										? warehouse.map((val) => (
												<option key={val.id} value={val.id}>
													{val.warehouse_name}
												</option>
										  ))
										: null}
								</Select>
							)}
							<InputGroup>
								<Input placeholder="Search..." ref={inputFileRef} />
								<InputRightElement cursor={"pointer"}>
									<Button
										border="none"
										onClick={() => {
											setPage(1);
											setSearch(inputFileRef.current.value);
										}}
									>
										<Icon as={FaSearch} color="gray.400" />
									</Button>
								</InputRightElement>
							</InputGroup>
						</Center>
						<SortStock
							pageWidth={pageWidth}
							handleSortChange={handleSortChange}
							sort={sort}
						/>

						{stockListOrGrid}
					</Flex>
					<Flex justifyContent={"end"} alignItems={"center"} gap={"30px"}>
						<Flex alignItems={"center"} gap={"5px"} mt={"15px"}>
							<Icon as={BsFillCircleFill} color={"red"} />
							<Flex>Stock = 0</Flex>
						</Flex>
						<Flex alignItems={"center"} gap={"5px"} mt={"15px"}>
							<Icon as={BsFillCircleFill} color={"orange"} />
							<Flex>{`Stock > 0`}</Flex>
						</Flex>
						<Flex alignItems={"center"} gap={"5px"} mt={"15px"}>
							<Icon as={BsFillCircleFill} color={"green"} />

							<Flex>{`Stock > 10`}</Flex>
						</Flex>
						<ButtonPage
							data={stock}
							page={page}
							totalPage={totalPage}
							handlePageChange={handlePageChange}
						/>
					</Flex>
				</Flex>
			</Center>
			<AddStockModal
				isOpen={addStockModal.isOpen}
				onClose={addStockModal.onClose}
				getStock={getStock}
			/>
			<AddCategoryModal
				isOpen={addCategoryModal.isOpen}
				onClose={addCategoryModal.onClose}
				getCategory={getCategory}
			/>
			<EditCategoryModal
				isOpen={editCategoryModal.isOpen}
				onClose={editCategoryModal.onClose}
			/>
			<DeleteCategoryModal
				isOpen={deleteCategoryModal.isOpen}
				onClose={deleteCategoryModal.onClose}
			/>
			<AddWarehouseModal
				isOpen={addWarehouseModal.isOpen}
				onClose={addWarehouseModal.onClose}
				getWarehouse={getWarehouse}
			/>
			<EditWarehouseModal
				isOpen={editWarehouseModal.isOpen}
				onClose={editWarehouseModal.onClose}
			/>
			<DeleteWarehouseModal
				isOpen={deleteWarehouseModal.isOpen}
				onClose={deleteWarehouseModal.onClose}
			/>
		</>
	);
}
