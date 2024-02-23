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
	Textarea,
	Select,
	Flex,
	Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { api } from "../../api/api";
import { useSelector } from "react-redux";

export default function EditProductModal({ isOpen, onClose, val, getProduct }) {
	const [selectedImages, setSelectedImages] = useState([]);
	const [category, setCategory] = useState([]);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [product, setProduct] = useState(val);
	const inputFileRef = useRef(null);
	const imagesProduct = val.product_images;
	const toast = useToast();
	const nav = useNavigate();
	const user = useSelector((state) => state.auth);

	useEffect(() => {
		setProduct(val);
	}, [val]);

	useEffect(() => {
		getCategory();
	}, [isOpen]);

	const editProduct = async () => {
		const formData = new FormData();
		formData.append("product_name", product.product_name);
		formData.append("product_detail", product.product_detail);
		formData.append("price", product.price);
		formData.append("weight", product.weight);
		formData.append("category_id", product.category_id);
		if (selectedFiles) {
			for (const files of selectedFiles) {
				formData.append("productImg", files);
			}
		}
		try {
			await api().patch(`/product/${val.id}`, formData);
			toast({
				title: "Product updated successfully.",
				status: "success",
				position: "top",
				duration: 3000,
			});
			getProduct();
			onClose();
			setSelectedImages([]);
			nav("/admin/product");
		} catch (error) {
			toast({
				title: error.response.data.message,
				status: "error",
				position: "top",
				duration: 3000,
			});
		}
	};

	async function getCategory() {
		const res = await api().get("/category");
		setCategory(res.data);
	}

	const handleImageChange = (event) => {
		const files = event.target.files;
		setSelectedFiles(files);
		const images = [];
		const maxImages = 5;
		const maxFileSizeBytes = 1024 * 1024;
		for (let i = 0; i < Math.min(files.length, maxImages); i++) {
			const file = files[i];
			if (file.size >= maxFileSizeBytes) {
				toast({
					title: "File is too large",
					status: "error",
					position: "top",
					duration: 3000,
				});
			} else {
				const imageUrl = URL.createObjectURL(file);
				images.push(imageUrl);
			}
		}

		setSelectedImages(images);

		const productImages = [];
		for (const file of files) {
			productImages.push(file);
		}
		setProduct((prevProduct) => ({
			...prevProduct,
			product_images: productImages,
		}));
	};

	function inputHandler(e) {
		const { id, value } = e.target;
		const temp = { ...product };
		temp[id] = value;
		setProduct(temp);
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				{user.role === "ADMIN" ? (
					<ModalHeader>Edit Product</ModalHeader>
				) : (
					<ModalHeader>Detail Product</ModalHeader>
				)}
				<ModalCloseButton />
				<ModalBody pb={6}>
					<FormControl>
						<FormLabel>Product Name:</FormLabel>
						<Input
							placeholder="e.g. MMS T-shirt"
							id="product_name"
							defaultValue={val.product_name}
							onChange={inputHandler}
						/>
						<FormLabel>Product Description:</FormLabel>
						<Textarea
							placeholder="e.g. A T-shirt with an impressive"
							id="product_detail"
							h={"120px"}
							defaultValue={val.product_detail}
							onChange={inputHandler}
						/>
						<FormLabel> Product Category:</FormLabel>
						<Select
							placeholder="Choose category"
							id="category_id"
							defaultValue={val.category_id}
							onChange={inputHandler}
						>
							{category.length
								? category.map((val) => (
										<option key={val.id} value={val.id}>
											{val.category_name}
										</option>
								  ))
								: null}
						</Select>
						<FormLabel>Price (Rp):</FormLabel>
						<Input
							type="number"
							placeholder="e.g. 500000"
							id="price"
							defaultValue={val.price}
							onChange={inputHandler}
						/>
						<FormLabel>Weight (g):</FormLabel>
						<Input
							type="number"
							placeholder="e.g. 100 "
							id="weight"
							defaultValue={val.weight}
							onChange={inputHandler}
						/>
						<FormLabel>Product Images:</FormLabel>
						{imagesProduct.length ? (
							<Flex
								flexWrap={"wrap"}
								flexDir={"row"}
								justifyContent={"center"}
								mt={"10px"}
								border={"1px"}
								borderRadius={"9px"}
								borderColor={"#E6EBF2"}
							>
								{imagesProduct.map((val) => (
									<Image
										src={`${process.env.REACT_APP_API_BASE_URL}/${val.product_image}`}
										style={{ width: "100px", height: "100px", margin: "8px" }}
									/>
								))}
							</Flex>
						) : null}
						{user.role === "ADMIN" ? (
							<FormLabel>Change Product Images:</FormLabel>
						) : null}
						{user.role === "ADMIN" ? (
							<>
								<Input
									accept="image/png, image/jpeg"
									type="file"
									id="product_images"
									paddingTop={"4px"}
									multiple
									onChange={handleImageChange}
									ref={inputFileRef}
									display={"none"}
								/>
								<Button
									onClick={() => inputFileRef.current.click()}
									size={"sm"}
									colorScheme="facebook"
								>
									Choose image
								</Button>
							</>
						) : null}
						{/* Preview the selected images */}
						{selectedImages.length ? (
							<Flex
								flexWrap={"wrap"}
								flexDir={"row"}
								justifyContent={"center"}
								mt={"10px"}
								border={"1px"}
								borderRadius={"9px"}
								borderColor={"#E6EBF2"}
							>
								{selectedImages.map((imageUrl, index) => (
									<Image
										key={index}
										src={imageUrl}
										alt={`Product Image ${index + 1}`}
										style={{ width: "100px", height: "100px", margin: "8px" }}
									/>
								))}
							</Flex>
						) : null}
					</FormControl>
				</ModalBody>
				{user.role === "ADMIN" ? (
					<ModalFooter justifyContent={"space-between"}>
						<Flex>Max: 1mb/file</Flex>
						<Button colorScheme="blue" mr={3} onClick={editProduct}>
							Save
						</Button>
					</ModalFooter>
				) : null}
			</ModalContent>
		</Modal>
	);
}
