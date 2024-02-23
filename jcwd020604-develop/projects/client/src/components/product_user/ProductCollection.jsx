import {
	Button,
	Center,
	Flex,
	Grid,
	Select,
	InputGroup,
	Input,
	InputRightElement,
	Icon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, Suspense, lazy, useRef } from "react";
import { api } from "../../api/api";
import { Link } from "react-router-dom";
import Loader from "../../utils/Loader";
import ButtonPageProduct from "./ButtonPageProduct";
import SelectCategory from "./SelectCategory";

const ProductCard = lazy(() => import("./ProductCard"));

export default function ProductCollection() {
	const [product, setProduct] = useState([]);
	const [category, setCategory] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [sort, setSort] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const inputFileRef = useRef(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getCategory();
	}, []);

	useEffect(() => {
		getAll();
	}, [selectedCategory, sort, search, page]);

	async function getAll() {
		setLoading(true);
		const res = await api().get("/product", {
			params: {
				category_id: selectedCategory,
				sort: sort,
				search: search,
				page: page,
			},
		});
		setProduct(res.data.rows);
		setTotalPage(Math.ceil(res.data.count / 12));
		setLoading(false);
	}

	async function getCategory() {
		const res = await api().get("/category");
		setCategory(res.data);
	}

	const handleCategoryChange = (categoryId) => {
		if (categoryId !== selectedCategory) {
			setSelectedCategory(categoryId);
		}
	};

	const handleSortChange = (sortOrder) => {
		if (
			sortOrder === "priceAsc" ||
			sortOrder === "priceDesc" ||
			sortOrder === "categoryAsc" ||
			sortOrder === "categoryDesc" ||
			sortOrder === "newest"
		) {
			setSort(sortOrder);
		} else {
			setSort(null);
		}
		setPage(1);
	};

	const handlePageChange = (newPage) => {
		if (newPage !== page) {
			setPage(newPage);
		}
	};

	// Grid Wrap
	const [pageWidth, setPageWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setPageWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	let templateColumns;

	if (pageWidth <= 600) {
		templateColumns = "repeat(2, 1fr)";
	} else if (pageWidth <= 800) {
		templateColumns = "repeat(3, 1fr)";
	} else {
		templateColumns = "repeat(4, 1fr)";
	}

	return (
		<Center padding={"15px"}>
			<Flex
				w={"1300px"}
				minW={"390px"}
				flexDir={"column"}
				justifyContent={"center"}
			>
				<Center margin={"0px 20px 30px"} fontSize={"32px"} fontWeight={"bold"}>
					{selectedCategory
						? category.find((val) => val.id === selectedCategory).category_name
						: "ALL ITEMS"}
				</Center>
				<SelectCategory
					selectedCategory={selectedCategory}
					category={category}
					handleCategoryChange={handleCategoryChange}
					setPage={setPage}
				/>
				<Flex
					justifyContent={"space-between"}
					paddingX={"40px"}
					alignItems={"center"}
					fontSize={"15px"}
					fontWeight={"bold"}
					flexWrap={"wrap"}
				>
					<Flex fontStyle={"italic"} gap={"5px"} alignItems={"center"}>
						<Flex fontSize={"22px"}>{product.length}</Flex>
						<Flex>cases</Flex>
					</Flex>
					<Flex gap={"15px"} fontSize={"13px"}>
						<Select
							onChange={(e) => handleSortChange(e.target.value)}
							placeholder="Sort product by:"
						>
							<option value="newest">Newest</option>
							<option value="priceAsc">Lowest Price</option>
							<option value="priceDesc">Highest Price</option>
						</Select>
						<InputGroup>
							<Input placeholder="Search..." ref={inputFileRef} />
							<InputRightElement cursor={"pointer"}>
								<Button
									border="none"
									onClick={() => {
										const searchValue = inputFileRef.current.value;
										setSearch(searchValue);
										setPage(1);
									}}
								>
									<Icon as={FaSearch} color="gray.400" />
								</Button>
							</InputRightElement>
						</InputGroup>
					</Flex>
				</Flex>
				{product.length > 0 ? (
					<Grid padding={"20px"} templateColumns={templateColumns} gap={"25px"}>
						{product.map((val) => {
							return (
								<Link to={`/collection/${val.uuid}`}>
									<Suspense fallback={<Loader />}>
										{loading ? (
											<Loader />
										) : (
											<>
												<ProductCard val={val} borderRadius={"15px"} />
											</>
										)}
									</Suspense>
								</Link>
							);
						})}
					</Grid>
				) : (
					<Center fontSize={"20px"} fontWeight={"bold"} marginTop={"40px"}>
						Product not available
					</Center>
				)}
				<ButtonPageProduct
					data={product}
					page={page}
					totalPage={totalPage}
					handlePageChange={handlePageChange}
				/>
			</Flex>
		</Center>
	);
}
