import { UpDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export default function SortMutation({ handleSortChange, sort, pageWidth }) {
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
								"product" + (sort === "productAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
					>
						Product Name
						<UpDownIcon ml={"10px"} />
						{sort === "productAsc" ? sort === "productDesc" : null}
					</Flex>
					<Flex
						w={"195px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"from_Warehouse" +
									(sort === "from_WarehouseDesc" ? "Asc" : "Desc")
							)
						}
						cursor="pointer"
					>
						Warehouse (From-To)
						{sort === "from_WarehouseDesc"
							? sort === "from_WarehouseAsc"
							: null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"195px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"mutation_code" + (sort === "mutation_codeAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
					>
						Mutation Code
						{sort === "mutation_codeAsc" ? sort === "mutation_codeDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"100px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange("qty" + (sort === "qtyAsc" ? "Desc" : "Asc"))
						}
						cursor="pointer"
					>
						Amount
						{sort === "qtyAsc" ? sort === "qtyDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"100px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"status" + (sort === "statusAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
					>
						Status
						{sort === "statusAsc" ? sort === "statusDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"170px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange("date" + (sort === "dateAsc" ? "Desc" : "Asc"))
						}
						cursor="pointer"
					>
						Date
						{sort === "dateAsc" ? sort === "dateDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex w={"25px"}></Flex>
				</Flex>
			) : null}
		</>
	);
}
