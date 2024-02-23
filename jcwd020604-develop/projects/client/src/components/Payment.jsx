import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineCopy } from "react-icons/ai";
import { BsImage } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const loc = useLocation();
  const inputFileRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [image, setImage] = useState();
  const toast = useToast();
  const userSelector = useSelector((state) => state.auth);
  const orderId = loc.pathname.split("/")[2];
  const [order, setOrder] = useState();
  const nav = useNavigate();
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false); // New state

  const uploadPaymentImg = async () => {
    try {
      const formData = new FormData();
      formData.append("paymentProof", selectedFiles);
      const res = await api().patch("/userOrders/payment/" + orderId, formData);
      toast({
        title: "Payment proof saved",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsPaymentConfirmed(true);
      nav("/order");
    } catch (err) {
      console.log(err);
    }
  };
  console.log();
  const fetchOrderById = async () => {
    try {
      const res = await api().get(`/userOrders/ordersUser/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchOrderById();
  }, []);

  const handleImageChange = (event) => {
    setSelectedFiles(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };
  return (
    <>
      <Navbar />
      <Center mb={10} mt={10} flexDir={"column"}>
        <Center flexDir={"column"} gap={"5px"}>
          <Box fontSize={18} fontWeight={"bold"}>
            Finish payment now!
          </Box>
        </Center>
        <Center mt={12}>
          <Box border={" 1px solid grey"} borderRadius={"10px"} w={"500px"}>
            <Box
              borderBottom={" 1px solid grey"}
              w={"499px"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box fontSize={18} p={"10px"} fontWeight={"semibold"}>
                Mandiri
              </Box>
              <Image
                mr={"5px"}
                w={"80px"}
                h={"35px"}
                src="https://kabarpolisi.com/wp-content/uploads/2017/03/04-07-24-LogoBankmandiriButtonBackgroudTransparentPNG.png"
              />
            </Box>
            <Box
              mt={"20px"}
              ml={"10px"}
              w={"480px"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box>
                <Box>Account Number</Box>
                <Box fontWeight={"semibold"}>1090018991489</Box>
              </Box>
              <Box
                mr={"8px"}
                fontSize={18}
                cursor={"pointer"}
                fontWeight={"bold"}
                color={"black"}
                display={"flex"}
                alignItems={"center"}
                gap={"4px"}
              >
                <Box color={"black"}>Copy</Box>
                <Box>
                  <AiOutlineCopy />
                </Box>
              </Box>
            </Box>
            <Box mt={"20px"} ml={"10px"} w={"480px"}>
              <Box fontWeight={"semibold"}>Product Name :</Box>
              <Box>
                {order?.order_details?.map((val) => (
                  <Flex flexDir={"column"}>
                    ✱ {val?.stock?.product?.product_name}
                  </Flex>
                ))}
              </Box>
            </Box>
            <Box
              mt={"20px"}
              ml={"10px"}
              w={"480px"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box>
                <Box fontWeight={"semibold"}>Total Payment</Box>
                <Box display={"flex"} alignItems={"center"} gap={"4px"}>
                  <Box fontWeight={"semibold"}>
                    {order?.total_price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </Box>
                  <AiOutlineCopy
                    style={{
                      color: "black",
                      cursor: "pointer",
                      fontSize: "18",
                    }}
                  />
                </Box>
              </Box>
              <Box
                fontSize={18}
                cursor={"pointer"}
                fontWeight={"bold"}
                mr={"8px"}
              ></Box>
            </Box>

            <Box
              mt={"20px"}
              ml={"10px"}
              w={"480px"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box>
                <Box fontWeight={"semibold"}>Upload Proof of Payment</Box>
              </Box>
              <Box
                mr={"8px"}
                fontSize={16}
                cursor={"pointer"}
                fontWeight={"bold"}
                color={"#ffe401"}
                display={"flex"}
                alignItems={"center"}
                gap={"4px"}
                onClick={() => inputFileRef.current.click()}
              >
                <label
                  htmlFor="image-upload"
                  style={{ cursor: "pointer", color: "black" }}
                >
                  Choose Image
                  <Input
                    accept="image/png, image/jpeg"
                    type="file"
                    id="productImg"
                    onChange={handleImageChange}
                    ref={inputFileRef}
                    display={"none"}
                  />
                </label>{" "}
                <Box>
                  <BsImage style={{ color: "black" }} />
                </Box>
              </Box>
            </Box>
            {/*  */}
            <Box p={3}>
              <Image src={image} />
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Box></Box>
              <Button
                margin={2}
                colorScheme="green"
                onClick={uploadPaymentImg}
                isDisabled={!image}
              >
                confirm
              </Button>
            </Box>
          </Box>
        </Center>
        <Center>
          <Box
            mt={"50px"}
            display={"flex"}
            justifyContent={"space-between"}
            w={"500px"}
          >
            <Link to={`/order`}>
              <Button w={"200px"} bgColor={"#ffe401"} borderRadius={"none"}>
                Check My Order
              </Button>
            </Link>
            <Button
              w={"200px"}
              bgColor={"#ffe401"}
              borderRadius={"none"}
              onClick={""}
            >
              Shop Again
            </Button>
          </Box>
        </Center>
      </Center>
      <Footer />
    </>
  );
}
