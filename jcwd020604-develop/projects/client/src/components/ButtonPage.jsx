import { Button, ButtonGroup } from "@chakra-ui/react";

export default function ButtonPage({
	data,
	page,
	totalPage,
	handlePageChange,
}) {
	return (
		<>
			{data?.length ? (
				<ButtonGroup
					paddingTop={"15px"}
					justifyContent={"end"}
					alignItems={"center"}
				>
					{page === 1 || data?.length === 0 ? null : (
						<Button
							onClick={() => {
								handlePageChange(page - 1);
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
						>
							Previous
						</Button>
					)}
					{page === totalPage || data?.length === 0 ? null : (
						<Button
							onClick={() => {
								handlePageChange(page + 1);
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
						>
							Next
						</Button>
					)}
				</ButtonGroup>
			) : null}
		</>
	);
}
