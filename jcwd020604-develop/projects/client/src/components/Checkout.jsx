import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Select,
  useToast,
  useDisclosure,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Loading from "./Loading";
import { api } from "../api/api";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AddressUser from "./NewAddressModal";

export default function Checkout() {
  const [product, setProduct] = useState([]);
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const addressUser = useDisclosure();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [fullname, setFullName] = useState(user.fullname);
  const [address, setAddress] = useState(user?.address?.address);
  const [changes, setChanges] = useState("");
  const [addressId, setAddressId] = useState("");
  const [users, setUsers] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [cityId, setCityId] = useState("");
  const nav = useNavigate();
  const [message, setMessage] = useState("");
  const [feeship, setFeeship] = useState(0);
  const handleAddressSelection = (addressId, cityId) => {
    setAddressId(addressId);
    setCityId(cityId);
  };
  const [shipping, setShipping] = useState([]);
  const [courier, setCourier] = useState();
  const fetchShipping = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    const destination = cityId;
    try {
      const response = await api().post("/cart/get/cost", {
        destination,
        addressId,
        weight: product.reduce((prev, curr) => {
          prev += curr.product.weight * curr.qty;
          return prev;
        }, 0),
        courier: courier,
      });
      setShipping(response.data);
    } catch (err) {
      setMessage(err);
    }
  };
  useEffect(() => {
    if (courier) {
      fetchShipping();
    }
  }, [courier]);
  const handleContinueShippingg = () => {
    if (addressId) {
      toast({
        title: "address selected",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Please select a shipping address",
        position: "top",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const order = async () => {
    try {
      const orderData = {
        courier: courier,
        addressId,
        shipping_cost: feeship,
        total_price: subTotal,
        user_id: user.id,
        address_id: addressId,
        payment_detail: "bank transfer",
        status: "WAITING_PAYMENT",
      };

      const response = await api().post("/userOrders/addOrder", orderData);

      const responseData = response.data;

      toast({
        title: "Order has been created",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: false,
      });
      nav("/order");
    } catch (error) {
      console.error(error);

      toast({
        title: "An error occurred while creating the order",
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  };
  useEffect(() => {
    getAddressByUser();
    fetchData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);
  const fetchData = async () => {
    try {
      const response = await api().get(
        `${process.env.REACT_APP_API_BASE_URL}/auth/users/${user.uuid}`,
        users
      );
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "There is something error while executing this command",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  };
  const getAddressByUser = async () => {
    try {
      const response = await api().get(
        `${process.env.REACT_APP_API_BASE_URL}/address/users/${user.id}`
      );
      setAddress(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching user details",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };
  async function getcart() {
    const res = await api().get(`/cart/` + user.id);
    setProduct(res.data);
  }
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
    getcart();
  }, []);
  return (
    <>
      <Navbar />
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <Center mt={"30px"} fontSize={"20px"}>
            <Box fontWeight={"bold"}>Checkout</Box>
          </Center>

          <Center mt={"50px"} mb={20} gap={"50px"}>
            <Flex
              border={"solid grey 1px"}
              borderTop={"none"}
              borderLeft={"none"}
              borderBottom={"none"}
              h={"800px"}
              w={"570px"}
              flexDir={"column"}
              gap={"10px"}
            >
              <Box fontSize={"18px"} fontWeight={"bold"}>
                Shipping address
              </Box>
              <Box
                w={"515px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Box></Box>
                <Button
                  h={"20px"}
                  w={"90px"}
                  fontSize={13}
                  bgColor={"white"}
                  _hover={"none"}
                  color={"blue"}
                  borderRadius={"none"}
                  onClick={() => addressUser.onOpen()}
                >
                  + new address
                </Button>
              </Box>
              {address?.length
                ? address?.map((val) => {
                    return (
                      <>
                        <Box display={"flex"} alignItems={"center"}>
                          <Box key={val.id} w={"515px"}>
                            <hr
                              style={{
                                width: "515px",
                              }}
                            />
                            <Box
                              mt={"8px"}
                              display={"flex"}
                              alignItems={"center"}
                            >
                              <Box fontWeight={"bold"}>{fullname}</Box>
                            </Box>

                            <Box display={"flex"} alignItems={"center"}>
                              <Box>{val?.address}</Box>
                            </Box>

                            <Box display={"flex"} alignItems={"center"} gap={1}>
                              <Box>{val?.district},</Box>
                              <Box>{val?.city},</Box>
                              <Box>{val?.province}</Box>
                            </Box>

                            <Box
                              mb={"10px"}
                              display={"flex"}
                              alignItems={"center"}
                            ></Box>
                            <hr
                              style={{
                                width: "515px",
                              }}
                            />
                          </Box>
                          <Box>
                            <Radio
                              w={"100px"}
                              onChange={() =>
                                handleAddressSelection(val.id, val.city_id)
                              }
                            ></Radio>
                          </Box>
                        </Box>
                      </>
                    );
                  })
                : null}
              <Box
                w={"515px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Box></Box>
                <Button
                  h={"20px"}
                  w={"90px"}
                  fontSize={13}
                  bgColor={"white"}
                  _hover={"none"}
                  color={"blue"}
                  borderRadius={"none"}
                  onClick={handleContinueShippingg}
                >
                  save address
                </Button>
              </Box>

              <Box mt={"20px"} w={"515px"}>
                <Box fontSize={"18px"} fontWeight={"bold"} mt={"10px"}>
                  Shipping method
                </Box>
                <RadioGroup onChange={setCourier} value={courier}>
                  <Stack direction="row">
                    <Radio w={"515px"} border={"1px"} mt={"20px"} value="jne">
                      JNE
                      <Image
                        w={"200px"}
                        h={"50px"}
                        src="data:image/png;base64,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"
                      />
                    </Radio>
                    <Radio value="tiki" w={"515px"} border={"1px"}>
                      TIKI
                      <Image
                        w={"200px"}
                        h={"50px"}
                        src="https://1.bp.blogspot.com/-uLgjCEGESQ4/X2GVUxAAThI/AAAAAAAAJdY/MC6BCnsxeecxVYMYWrRiJX6KgP7jUjufgCNcBGAsYHQ/w1200-h630-p-k-no-nu/2020-09-16%2B11_30_59-Cek-Resi-TIKI.png%2B%2528PNG%2BImage%252C%2B769%25C2%25A0%25C3%2597%25C2%25A0600%2Bpixels%2529.png"
                      />
                    </Radio>
                    <Radio
                      value="pos"
                      display={"flex"}
                      w={"515px"}
                      border={"1px"}
                    >
                      POS Indonesia
                      <Image
                        w={"200px"}
                        h={"50px"}
                        src="https://www.suarasurabaya.net/wp-content/uploads/2020/09/pos-indonesia-840x493.jpg"
                      />
                    </Radio>
                  </Stack>
                </RadioGroup>

                <Box p={4}>
                  <Select
                    fontSize={15}
                    placeholder="Select shipping"
                    onClick={(e) => {
                      setFeeship(e.target.value);
                    }}
                  >
                    {shipping?.map((val) => (
                      <option
                        key={val.id}
                        value={val?.costs[0]?.cost[0]?.value}
                      >
                        {`${val.name} - ${val?.costs[0]?.description} - (${
                          val?.costs[0]?.cost[0]?.etd
                        } days) -  Rp ${val?.costs[0]?.cost[0]?.value.toLocaleString(
                          "id-ID"
                        )},00`}{" "}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box fontSize={"18px"} fontWeight={"bold"} mt={"40px"}>
                  Payment method
                </Box>
                <Box
                  fontSize={15}
                  display={"flex"}
                  w={"515px"}
                  mt={"10px"}
                  justifyContent={"space-between"}
                >
                  <Box display={"flex"} gap={"5px"}>
                    <Box>Transfer</Box>
                    <Box fontWeight={"bold"}>ONLY</Box>
                  </Box>
                  <Image
                    w={"150px"}
                    h={"60px"}
                    src="https://logos-download.com/wp-content/uploads/2016/06/Mandiri_logo.png"
                  />
                  <Box>
                    <Box fontWeight={"bold"}>BANK Mandiri</Box>
                    <Box>MMSAPPAREL</Box>
                    <Box fontWeight={"semibold"}>1090018991489</Box>
                  </Box>
                </Box>
              </Box>
              <Box
                mt={"50px"}
                display={"flex"}
                justifyContent={"space-between"}
                w={"500px"}
              >
                <Link to={`/cart`}>
                  <Button w={"200px"} bgColor={"#ffe401"} borderRadius={"none"}>
                    Return to cart
                  </Button>
                </Link>
                <Button
                  w={"200px"}
                  bgColor={"#ffe401"}
                  borderRadius={"none"}
                  isLoading={isLoading}
                  loadingText="Placing Order"
                  onClick={order}
                >
                  Order
                </Button>
              </Box>
            </Flex>

            <Flex w={"350px"} flexDir={"column"} h={"800px"}>
              <Box fontWeight={"bold"}>Delivery1</Box>
              {product &&
                product?.map((val) => (
                  <Box
                    w={"350px"}
                    mt={"20px"}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <Box>
                      <Box
                        bgColor={"#ffe401"}
                        w={"22px"}
                        h={"22px"}
                        fontSize={10}
                        textAlign={"center"}
                        fontWeight={"bold"}
                      >
                        {val.qty}
                      </Box>
                      <Image
                        width={"100px"}
                        h={"100px"}
                        src={`${process.env.REACT_APP_API_BASE_URL}/${val.product.product_images[0].product_image}`}
                      />
                    </Box>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      w={"249px"}
                    >
                      <Box fontSize={"12px"}>{val.product.product_name}</Box>
                      <Box fontWeight={"bold"} fontSize={"13px"} w={"100px"}>
                        Rp{" "}
                        {val.product.price
                          ? val.product.price.toLocaleString("id-ID")
                          : "Price Not Available"}
                        ,00
                      </Box>
                    </Box>
                  </Box>
                ))}

              <hr
                style={{
                  border: "1px solid grey",
                  width: "350px",
                  marginTop: "30px",
                }}
              />
              <Box
                mt={"30px"}
                w={"350px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Box fontSize={"14px"}>Subtotal</Box>
                <Box fontWeight={"bold"} fontSize={"15px"}>
                  Rp{" "}
                  {subTotal
                    ? parseInt(subTotal).toLocaleString("id-ID")
                    : "Price Not Available"}
                  ,00
                </Box>
              </Box>
              <Box
                mt={"10px"}
                w={"350px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Box fontSize={"14px"}>Shipping fee</Box>
                <Box fontWeight={"bold"} fontSize={"15px"}>
                  Rp {feeship ? parseInt(feeship).toLocaleString("id-ID") : "0"}
                  ,00
                </Box>
              </Box>
              <hr
                style={{
                  border: "1px solid grey",
                  width: "350px",
                  marginTop: "30px",
                }}
              />
              <Box
                mt={"10px"}
                w={"350px"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Box fontSize={"16px"}>Total</Box>
                <Box fontWeight={"bold"} fontSize={"17px"}>
                  Rp{" "}
                  {subTotal && feeship
                    ? (subTotal + parseInt(feeship)).toLocaleString("id-ID")
                    : parseInt(subTotal)}
                  ,00
                </Box>
              </Box>
            </Flex>
          </Center>
        </form>
      )}
      ;{" "}
      <AddressUser
        isOpen={addressUser.isOpen}
        onClose={addressUser.onClose}
        getAddressByUser={getAddressByUser}
      />
      <Footer />
    </>
  );
}
