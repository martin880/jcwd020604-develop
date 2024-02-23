import { Box, Flex, Image } from "@chakra-ui/react";
import { useState } from "react";

export default function ProductCard({ val }) {
	const [stock, setStock] = useState(
		val.stocks.reduce((accumulator, val) => accumulator + val.qty, 0)
	);
	const [hovered, setHovered] = useState(false);
	const isSoldOut = stock === 0;
	return (
		<Box
			w={"100%"}
			maxW={"383px"}
			h={"100%"}
			flexDir={"row"}
			borderRadius={"15px"}
			boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
			_hover={{
				backgroundColor: "#E6EBF2",
			}}
		>
			<Image
				src={
					hovered
						? `${process.env.REACT_APP_API_BASE_URL}/${val.product_images[1]?.product_image}`
						: `${process.env.REACT_APP_API_BASE_URL}/${val.product_images[0]?.product_image}`
				}
				style={{
					width: "100%",
					maxHeight: "500px",
					maxWidth: "383px",
					borderRadius: "15px",
				}}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			/>
			<Flex
				h={"auto"}
				flexDir={"column"}
				padding={"15px"}
				justifyContent={"end"}
			>
				<Flex>{val.product_name}</Flex>
				<Flex fontSize={"18px"} fontWeight={"bold"}>
					{isSoldOut ? (
						<Flex flexWrap={"wrap"}>
							<Flex style={{ textDecoration: "line-through" }}>
								Rp{" "}
								{val.price
									? val.price.toLocaleString("id-ID")
									: "Price Not Available"}
								,00
							</Flex>
							<Flex style={{ color: "red", marginLeft: "8px" }}>SOLD OUT</Flex>
						</Flex>
					) : (
						<Flex>
							Rp{" "}
							{val.price
								? val.price.toLocaleString("id-ID")
								: "Price Not Available"}
							,00
						</Flex>
					)}
				</Flex>
			</Flex>
		</Box>
	);
}
