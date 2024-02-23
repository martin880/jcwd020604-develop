import { UpDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export default function SortProduct({ handleSortChange, sort, pageWidth }) {
	return (
		<>
			{pageWidth > 900 ? (
				<Flex
					padding={"7px"}
					borderBottom={"1px"}
					fontWeight={600}
					borderColor={"#E6EBF2"}
					gap={"7"}
				>
					<Flex
						w={"325px"}
						minW={"275px"}
						paddingLeft={"55px"}
						onClick={() =>
							handleSortChange(
								"product" + (sort === "productDesc" ? "Asc" : "Desc")
							)
						}
						cursor="pointer"
						alignItems={"center"}
					>
						Product Name
						<UpDownIcon ml={"10px"} />
						{sort === "productDesc" ? sort === "productAsc" : null}
					</Flex>
					<Flex w={"300px"} alignItems={"center"}>
						Description
					</Flex>
					<Flex
						w={"160px"}
						onClick={() =>
							handleSortChange(
								"category" + (sort === "categoryAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
						alignItems={"center"}
					>
						Category
						{sort === "categoryAsc" ? sort === "categoryDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"160px"}
						onClick={() =>
							handleSortChange("price" + (sort === "priceAsc" ? "Desc" : "Asc"))
						}
						cursor="pointer"
						alignItems={"center"}
					>
						Price (Rp)
						{sort === "priceAsc" ? sort === "priceDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"160px"}
						onClick={() =>
							handleSortChange(
								"weight" + (sort === "weightAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
						alignItems={"center"}
					>
						Weight (g)
						{sort === "weightAsc" ? sort === "weightDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex w={"25px"}></Flex>
				</Flex>
			) : null}
		</>
	);
}
