import {
	Button,
	Flex,
	Icon,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from "@chakra-ui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function CartButton({
	value,
	stock,
	isSoldOut,
	handleDecrement,
	handleIncrement,
	addCart,
	userSelector,
}) {
	return (
		<Flex justifyContent={"space-between"} alignItems={"center"}>
			<NumberInput
				defaultValue={value}
				min={1}
				max={stock}
				paddingLeft={"150px"}
				paddingBottom={"50px"}
				isDisabled={isSoldOut}
			>
				<NumberInputStepper
					w={"160px"}
					h={"50px"}
					display={"flex"}
					flexDir={"row"}
					gap={"10px"}
					alignItems={"center"}
				>
					<NumberDecrementStepper
						onClick={handleDecrement}
						fontSize={"15px"}
						borderColor={"transparent"}
						marginLeft={"10px"}
					/>
					<NumberInputField textAlign="center" paddingLeft={"30px"} />

					<NumberIncrementStepper
						onClick={handleIncrement}
						fontSize={"15px"}
						borderColor={"transparent"}
						marginRight={"10px"}
					/>
				</NumberInputStepper>
			</NumberInput>
			<Button
				onClick={() => {
					addCart();
				}}
				w={"150px"}
				h={"50px"}
				bgColor={"yellow"}
				fontWeight={"bold"}
				_hover={{ bgColor: "yellow.200" }}
				isDisabled={isSoldOut || userSelector.role !== "USER"}
			>
				<Icon as={AiOutlineShoppingCart} fontSize={"25px"} />
				CART
			</Button>
		</Flex>
	);
}
