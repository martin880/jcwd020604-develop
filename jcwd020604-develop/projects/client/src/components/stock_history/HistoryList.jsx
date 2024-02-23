import { Flex, Image } from "@chakra-ui/react";
import moment from "moment";

export default function HistoryList({ val }) {
	return (
		<>
			{val?.stock?.id ? (
				<Flex
					padding={"7px"}
					borderBottom={"1px"}
					borderColor={"#E6EBF2"}
					gap={"7"}
					alignItems={"center"}
					_hover={{
						backgroundColor: "#E6EBF2",
					}}
				>
					<Flex gap={"5px"} alignItems={"center"}>
						<Image
							w={"50px"}
							h={"50px"}
							borderRadius={"4px"}
							src={
								`${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.product?.product_images[0]}`
									? `${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.product?.product_images[0].product_image}`
									: null
							}
						/>
						<Flex w={"270px"}>{val?.stock?.product?.product_name}</Flex>
					</Flex>
					<Flex w={"195px"}>
						{val?.stock?.warehouse?.warehouse_name
							? val?.stock?.warehouse?.warehouse_name
							: "Undefined warehouse"}
					</Flex>
					<Flex w={"115px"} gap={"5px"}>
						<Flex>{val?.stock_after}</Flex>
						<Flex style={{ color: val?.qty < 0 ? "red" : "green" }}>
							{val?.qty === 0 ? null : `(${val?.qty})`}
						</Flex>
					</Flex>
					<Flex w={"100px"}>{val?.status}</Flex>
					<Flex w={"179px"}>{val?.reference}</Flex>
					<Flex w={"179px"}>
						{moment(val?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
					</Flex>
					<Flex w={"10px"} h={"20px"}></Flex>
				</Flex>
			) : null}
		</>
	);
}
