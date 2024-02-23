import { UpDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export default function SortHistory({ handleSortChange, sort, pageWidth }) {
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
						w={"115px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"stockAfter" + (sort === "stockAfterAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
					>
						Stock
						{sort === "stockAfterAsc" ? sort === "stockAfterDesc" : null}
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
						w={"179px"}
						alignItems={"center"}
						onClick={() =>
							handleSortChange(
								"reference" + (sort === "referenceAsc" ? "Desc" : "Asc")
							)
						}
						cursor="pointer"
					>
						Reference
						{sort === "referenceAsc" ? sort === "referenceDesc" : null}
						<UpDownIcon ml={"10px"} />
					</Flex>
					<Flex
						w={"179px"}
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
					<Flex w={"10px"}></Flex>
				</Flex>
			) : null}
		</>
	);
}
