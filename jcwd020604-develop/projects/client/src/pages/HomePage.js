import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Carousel from "./carousel/Carousel";
import GridCategory from "./grid/GridCategory";
import GridProduct from "./grid/GridProduct";

export default function HomePage() {
	return (
		<>
			<Navbar />
			<Carousel />
			<GridCategory />
			<GridProduct />
			<Footer />
		</>
	);
}
