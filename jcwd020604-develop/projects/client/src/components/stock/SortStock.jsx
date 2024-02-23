import { UpDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export default function SortStock({ handleSortChange, sort, pageWidth }) {
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
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"product" + (sort === "productDesc" ? "Asc" : "Desc")
							)
						}
						cursor="pointer"
					>
						Product Name
						<UpDownIcon ml={"10px"} />
						{sort === "productDesc" ? sort === "productAsc" : null}
					</Flex>
					<Flex
						w={"190px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"warehouse" + (sort === "warehouseAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
					>
						Warehouse
						{sort === "warehouseAsc" ? sort === "warehouseDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"190px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"category" + (sort === "categoryAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
					>
						Category
						{sort === "categoryAsc" ? sort === "categoryDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"190px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange("qty" + (sort === "qtyAsc" ? "Desc" : "Asc"))
						}
						cursor="pointer"
					>
						Stock
						<UpDownIcon ml={"10px"} />
						{sort === "qtyAsc" ? sort === "qtyDesc" : null}
					</Flex>
					<Flex w={"190px"} alignItems={"center"}>
						Status
					</Flex>
					<Flex w={"25px"}></Flex>
				</Flex>
			) : null}
		</>
	);
}
