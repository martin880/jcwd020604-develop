import { Button, ButtonGroup } from "@chakra-ui/react";

export default function ButtonPageProduct({
	data,
	page,
	handlePageChange,
	totalPage,
}) {
	return (
		<>
			{data.length > 0 && (
				<ButtonGroup
					justifyContent={"center"}
					gap={"25px"}
					marginBottom={"25px"}
				>
					{page === 1 ? (
						<Button
							isDisabled
							// bgColor={"white"}
							w={"117px"}
							boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
						>
							PREVIOUS
						</Button>
					) : (
						<Button
							// bgColor={"white"}
							w={"117px"}
							boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
							onClick={() => {
								handlePageChange(page - 1);
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
						>
							PREVIOUS
						</Button>
					)}
					{page === totalPage ? (
						<Button
							isDisabled
							// bgColor={"white"}
							w={"117px"}
							boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
						>
							NEXT
						</Button>
					) : (
						<Button
							// bgColor={"white"}
							w={"117px"}
							boxShadow="0 2px 4px rgba(0, 0, 0, 0.4)"
							onClick={() => {
								handlePageChange(page + 1);
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
						>
							NEXT
						</Button>
					)}
				</ButtonGroup>
			)}
		</>
	);
}
