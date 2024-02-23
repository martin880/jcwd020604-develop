import { Center, Image } from "@chakra-ui/react";
import LoadingLogo from "../assets/Infinity.svg";

export default function Loading(props) {
  return (
    <Center w={"100vw"} h="100vh">
      <Image w="100px" src={LoadingLogo}></Image>
    </Center>
  );
}
