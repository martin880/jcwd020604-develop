import { useState, useEffect } from "react";
import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// And react-slick as our Carousel Lib
import Slider from "react-slick";
import { api } from "../../api/api";
import { useParams } from "react-router-dom";

// Settings for the slider
const settings = {
	dots: true,
	arrows: false,
	fade: true,
	infinite: true,
	slidesToShow: 1,
	slidesToScroll: 1,
};

export default function CarouselProduct() {
	// As we have used custom buttons, we need a reference variable to
	// change the state
	const [slider, setSlider] = useState(<Slider />);
	const [productImage, setProductImage] = useState([]);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const { uuid } = useParams();

	async function getProductById() {
		const res = await api().get(`/product/${uuid}`);
		setProductImage(
			res.data.product_images.map(
				(val) => `${process.env.REACT_APP_API_BASE_URL}/${val.product_image}`
			)
		);
	}

	useEffect(() => {
		getProductById();
	}, []);

	// These are the breakpoints which changes the position of the
	// buttons as the screen size changes
	const top = useBreakpointValue({ base: "90%", md: "50%" });
	const side = useBreakpointValue({ base: "30%", md: "10px" });

	return (
		<Box
			position={"relative"}
			minH={"400px"}
			w={["100%", "100%", "100%", "700px"]} // Adjust width based on screen size
			h={"auto"} // Adjust width based on screen size
			overflow={"hidden"}
			minW={"390px"}
			paddingBottom={"25px"}
		>
			{/* CSS files for react-slick */}
			<link
				rel="stylesheet"
				type="text/css"
				charSet="UTF-8"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
			/>
			<link
				rel="stylesheet"
				type="text/css"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
			/>
			{/* Left Icon */}
			<IconButton
				aria-label="left-arrow"
				colorScheme="blackAlpha"
				borderRadius="full"
				position="absolute"
				left={side}
				top={top}
				transform={"translate(0%, -50%)"}
				zIndex={2}
				onClick={() => slider?.slickPrev()}
			>
				<BiLeftArrowAlt />
			</IconButton>
			{/* Right Icon */}
			<IconButton
				aria-label="right-arrow"
				colorScheme="blackAlpha"
				borderRadius="full"
				position="absolute"
				right={side}
				top={top}
				transform={"translate(0%, -50%)"}
				zIndex={2}
				onClick={() => slider?.slickNext()}
			>
				<BiRightArrowAlt />
			</IconButton>
			{/* Slider */}
			<Slider {...settings} ref={(slider) => setSlider(slider)}>
				{productImage.map((url, index) => (
					<Box
						borderRadius={"15px"}
						key={index}
						height={windowWidth >= 600 ? "3xl" : "xl"}
						position="relative"
						backgroundPosition="center"
						backgroundRepeat="no-repeat"
						backgroundSize="cover"
						backgroundImage={`url(${url})`}
					/>
				))}
			</Slider>
		</Box>
	);
}
