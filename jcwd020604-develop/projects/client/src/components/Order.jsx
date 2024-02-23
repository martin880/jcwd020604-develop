import {
  Box,
  Button,
  Center,
  Image,
  Link,
  useToast,
  ButtonGroup,
  Flex,
  Icon,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState, useRef, useEffect } from "react";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { BsEnvelopePaperHeart } from "react-icons/bs";
import { IoMdTime } from "react-icons/io";
import { AiOutlineCheckCircle } from "react-icons/ai";

export default function Order() {
  const [subTotal, setSubTotal] = useState(0);
  const nav = useNavigate();
  const toast = useToast();
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [product, setProduct] = useState([]);
  const user = useSelector((state) => state.auth);
  const [order, setOrder] = useState([]);
  const [orderId, setOrderId] = useState(0);

  async function getOrder() {
    const res = await api().get(`/userOrders/orders/` + user.id, {
      params: {
        page: page,
      },
    });
    const { rows, count } = res.data;
    setOrder(rows);
    setTotalPage(Math.ceil(count / 3));
  }
  async function cancelOrder() {
    try {
      const res = await api().delete(`/userOrders/orders/` + orderId);
      getOrder();
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (orderId) cancelOrder();
  }, [orderId]);

  const orderDetail = async () => {
    try {
      // Prepare the order data
      const orderData = {
        // qty,
        // price,
        // stock_id,
        // order_id,
      };

      // Send the order data to the backend
      const response = await api().post("/order-detail", orderData);

      // Handle the response
      const responseData = response.data;
      console.log(responseData);

      // Show a success message to the user
      toast({
        title: "Order detail has been created",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: false,
      });

      console.log("Order has been created");
    } catch (error) {
      // Handle any errors that might occur
      console.error(error);

      // Show an error message to the user
      toast({
        title: "An error occurred while creating the order",
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  };

  const calculateTotal = () => {
    let total = 0;
    product.forEach((val) => {
      total += val.subtotal;
    });
    return total;
  };

  useEffect(() => {
    const total = calculateTotal();
    setSubTotal(total);
  }, [product]);

  useEffect(() => {
    getOrder();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  console.log(order);

  const userDone = async (orderId) => {
    try {
      await api().patch(`/userOrders/orders-done/${orderId}`, {
        action: "done",
      });
      toast({
        title: "Order has been arrived",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: false,
      });
      getOrder();
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: false,
      });
    }
  };
  useEffect(() => {
    getOrder();
  }, [page]);

  return (
    <>
      <Navbar />
      <Center mb={"50px"} mt={"50px"}>
        <Box w={"900px"} h={"800px"}>
          <Box
            gap={"10px"}
            alignItems={"center"}
            justifyContent={"center"}
            display={"flex"}
            mt={"10px"}
            fontSize={"large"}
          >
            <Box>Order List</Box>
            <BsEnvelopePaperHeart />
          </Box>
          <hr
            style={{
              marginTop: "10px",
            }}
          />
          {order.length
            ? order?.map((val) => (
                <>
                  <Box key={val.id}>
                    <Box
                      w={"900px"}
                      mt={"40px"}
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Box display={"flex"} alignItems={"center"} gap={"5px"}>
                        <Image
                          width={"100px"}
                          h={"100px"}
                          src={`${process.env.REACT_APP_API_BASE_URL}/
														${val.order_details[0].stock.product.product_images[0].product_image}
													`}
                        />
                        <Box display={"flex"} flexDir={"column"} w={"500px"}>
                          <Box fontSize={17}>
                            {val.order_details[0].stock.product.product_name}{" "}
                            (Weight: {val.order_details[0].stock.product.weight}
                            )
                          </Box>
                          <Box
                            w={"22px"}
                            h={"22px"}
                            fontSize={14}
                            textAlign={"center"}
                            fontWeight={"bold"}
                          >
                            {val.order_details[0].qty}
                          </Box>
                        </Box>
                      </Box>

                      <Box fontWeight={"bold"} fontSize={"13px"} w={"100px"}>
                        Rp
                        {val.order_details[0].stock.product.price
                          ? val.order_details[0].stock.product.price.toLocaleString(
                              "id-ID"
                            )
                          : "Price Not Available"}
                        ,00
                      </Box>
                    </Box>
                    <Box>
                      <hr />
                    </Box>
                  </Box>

                  <Box
                    w={"900px"}
                    display={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Box></Box>

                    <Box display={"flex"} mt={"20px"} gap={"5px"}>
                      <Box>Total Price :</Box>
                      <Box fontWeight={"bold"}>
                        {" "}
                        Rp{" "}
                        {val.total_price
                          ? val.total_price.toLocaleString("id-ID")
                          : "Price Not Available"}
                        ,00
                      </Box>
                    </Box>
                  </Box>
                  <Flex justifyContent={"space-between"} mt={"10px"}>
                    <Flex fontWeight={"bold"}>Status :</Flex>
                    {val.status === "DONE" ? (
                      <Flex alignItems={"center"} gap={"5px"} color={"green"}>
                        <Flex>Product Arrived</Flex>
                        <AiOutlineCheckCircle />
                      </Flex>
                    ) : val.status === "WAITING_PAYMENT" &&
                      val.payment_proof ? (
                      <Flex color={"blue"} alignItems={"center"} gap={"5px"}>
                        <Flex>Waiting admin confirm </Flex>
                        <IoMdTime />
                      </Flex>
                    ) : val.status === "WAITING_PAYMENT" &&
                      !val.payment_proof ? (
                      <Flex color={"blue"} alignItems={"center"} gap={"5px"}>
                        <Flex>Waiting Payment </Flex>
                        <IoMdTime />
                      </Flex>
                    ) : (
                      val.status
                    )}
                  </Flex>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    mt={"20px"}
                  >
                    <Box></Box>
                    {!val.payment_proof && val.status === "WAITING_PAYMENT" ? (
                      <Box display={"flex"} gap={"10px"}>
                        <Box>
                          <Button
                            w={"200px"}
                            bgColor={"#ffe401"}
                            borderRadius={"none"}
                            onClick={() => nav(`/payment/${val.id}`)}
                          >
                            See & Payment
                          </Button>
                        </Box>
                        {val.status !== "CANCELLED" && (
                          <Box>
                            <Button
                              w={"200px"}
                              bgColor={"white"}
                              border={"1px solid grey"}
                              borderRadius={"none"}
                              onClick={() => {
                                setOrderId(val.id);
                              }}
                            >
                              Cancel order
                            </Button>
                          </Box>
                        )}
                      </Box>
                    ) : null}
                    {val.payment_proof && val.status === "DELIVERY" ? (
                      <Button
                        onClick={() => userDone(val.id)}
                        w={"200px"}
                        bgColor={"#1EFF43"}
                        borderRadius={"none"}
                      >
                        Order Received
                      </Button>
                    ) : null}
                  </Box>
                </>
              ))
            : null}
        </Box>
      </Center>
      <ButtonGroup
        p={20}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        size={"xs"}
        colorScheme={"cyan"}
      >
        {page === 1 || order?.length === 0 ? null : (
          <Button
            w={"80px"}
            borderRadius={"none"}
            onClick={() => {
              handlePageChange(page - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Previous
          </Button>
        )}
        {page === totalPage || order?.length === 0 ? null : (
          <Button
            w={"80px"}
            borderRadius={"none"}
            onClick={() => {
              handlePageChange(page + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next
          </Button>
        )}
      </ButtonGroup>
      <Footer />
    </>
  );
}
