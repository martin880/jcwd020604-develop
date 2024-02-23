import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Box } from "@chakra-ui/react";
import Slider from "react-slick";
import Product1 from "../../assets/product photos/ACCESORIES/chingco1.jpg";
import Product2 from "../../assets/product photos/BOTTOMS/Pants1.jpg";
import Product3 from "../../assets/product photos/HEADWEARS/BermudaFurHat1.jpg";
import Product4 from "../../assets/product photos/TOPS/BouncingRabbitLongsleeveT-shirt1.jpg";

const settings = {
	dots: true,
	arrows: false,
	fade: true,
	infinite: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 3000
};

export default function Carousel() {
	const sliderRef = useRef(null);
	const navigate = useNavigate();
	const [slider, setSlider] = useState(<Slider />);
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

	useEffect(() => {
		const interval = setInterval(() => {
		  sliderRef.current.slickNext();
		}, settings.autoplaySpeed);
	
		return () => clearInterval(interval);
	  }, []);

  const card = [
    Product1, Product2, Product3, Product4
  ]

	return (
		<Box position={'relative'} height={'600px'} width={'full'} overflow={'hidden'} mb={4}>
			<link
				rel="stylesheet"
				type="text/css"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
			/>
			<link
				rel="stylesheet"
				type="text/css"
				href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
			/>
				<Slider {...settings} ref={(sliderRef) => setSlider(sliderRef)}>
					{card.map((url, index) => (
						<Box
							key={index}
							height={windowWidth >= 600 ? "3xl" : "xl"}
							position="relative"
							backgroundPosition="center"
							backgroundRepeat="no-repeat"
							backgroundSize="cover"
							backgroundImage={`url(${url})`}
							cursor={'pointer'}
							onClick={() => navigate('/collection')}
						/>
					))}
				</Slider>
		</Box>
	);
}
