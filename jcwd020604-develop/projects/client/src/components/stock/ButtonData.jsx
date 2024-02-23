import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Button,
} from "@chakra-ui/react";

export default function ButtonData({
	user,
	addCategoryModal,
	addWarehouseModal,
	editCategoryModal,
	editWarehouseModal,
	deleteCategoryModal,
	deleteWarehouseModal,
}) {
	return (
		<>
			{user.role === "ADMIN" ? (
				<Flex gap={"15px"}>
					<Menu>
						<MenuButton as={Button}>
							<AddIcon />
						</MenuButton>
						<MenuList>
							<MenuItem onClick={addCategoryModal.onOpen}>
								Add Category
							</MenuItem>
							<MenuItem onClick={addWarehouseModal.onOpen}>
								Add Warehouse
							</MenuItem>
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button}>
							<EditIcon />
						</MenuButton>
						<MenuList>
							<MenuItem onClick={editCategoryModal.onOpen}>
								View / Edit Category
							</MenuItem>
							<MenuItem onClick={editWarehouseModal.onOpen}>
								View / Edit Warehouse
							</MenuItem>
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} colorScheme="red" color={"white"}>
							<DeleteIcon />
						</MenuButton>
						<MenuList>
							<MenuItem color={"red"} onClick={deleteCategoryModal.onOpen}>
								Delete Category
							</MenuItem>
							<MenuItem color={"red"} onClick={deleteWarehouseModal.onOpen}>
								Delete Warehouse
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			) : null}
		</>
	);
}
