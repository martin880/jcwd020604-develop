import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loader() {
	return (
		<>
			<SkeletonTheme color={"#202020 "} highlightColor={"#444"}>
				<Skeleton duration={2} />
			</SkeletonTheme>
		</>
	);
}
