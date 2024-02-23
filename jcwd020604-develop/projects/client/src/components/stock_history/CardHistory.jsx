import {
	Flex,
	Image,
	Card,
	CardBody,
	Stack,
	Heading,
	Text,
} from "@chakra-ui/react";
import moment from "moment";

export default function HistoryCard({ val }) {
	return (
		<>
			{val?.stock?.id ? (
				<Card
					maxW="xs"
					_hover={{
						backgroundColor: "#E6EBF2",
					}}
				>
					<CardBody>
						<Image
							src={
								`${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.product?.product_images[0]}`
									? `${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.product?.product_images[0].product_image}`
									: null
							}
							borderRadius="lg"
						/>
						<Stack mt="6" spacing="2">
							<Flex flexDir={"column"} justifyContent={"space-between"}>
								<Text>
									<Heading size="md">
										{val?.stock?.product?.product_name}
									</Heading>
								</Text>

								<Flex flexDir={"column"}>
									<Flex gap={"5px"}>
										<Flex>
											{" "}
											{val?.stock?.warehouse?.warehouse_name
												? val?.stock?.warehouse?.warehouse_name
												: "Undefined warehouse"}
										</Flex>
										<Flex>{`(${val?.status})`}</Flex>
									</Flex>
									<Flex gap={"5px"}>
										<Flex>{val?.stock_after} </Flex>
										<Flex style={{ color: val?.qty < 0 ? "red" : "green" }}>
											{val?.qty === 0 ? null : `(${val?.qty})`}
										</Flex>
									</Flex>

									<Flex>{val?.reference}</Flex>
									<Flex>
										{moment(val?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
									</Flex>
								</Flex>
							</Flex>
						</Stack>
					</CardBody>
				</Card>
			) : null}
		</>
	);
}
