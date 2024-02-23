import { Center, Flex } from "@chakra-ui/react";

export default function SelectCategory({
	selectedCategory,
	handleCategoryChange,
	category,
	setPage,
}) {
	return (
		<Center gap={"10px"} marginBottom={"20px"} flexWrap={"wrap"}>
			<Flex
				padding={"7px 12px"}
				border={"1px"}
				fontSize={"15px"}
				fontWeight={"bold"}
				cursor={"pointer"}
				style={{
					backgroundColor: selectedCategory === "" ? "yellow" : "",
					border: selectedCategory === "" ? "1px solid white" : "1px solid",
					color: selectedCategory === "" ? "black" : "",
				}}
				borderRadius={"5px"}
				onClick={() => handleCategoryChange("")}
			>
				ALL ITEMS
			</Flex>
			{category.length
				? category.map((val) => {
						return (
							<Flex
								padding={"7px 12px"}
								border={"1px"}
								fontSize={"15px"}
								fontWeight={"bold"}
								cursor={"pointer"}
								style={{
									backgroundColor: selectedCategory === val.id ? "yellow" : "",
									border:
										selectedCategory === val.id
											? "1px solid white"
											: "1px solid",
									color: selectedCategory === val.id ? "black" : "",
								}}
								borderRadius={"5px"}
								onClick={() => {
									setPage(1);
									handleCategoryChange(val.id);
								}}
							>
								{val.category_name}
							</Flex>
						);
				  })
				: null}
		</Center>
	);
}
