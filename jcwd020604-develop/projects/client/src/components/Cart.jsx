import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Icon,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
// import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector";
import { api } from "../api/api";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Cart() {
  // const { user_id } = useParams();
  const userSelector = useSelector((state) => state.auth);
  const [product, setProduct] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [stock, setStock] = useState(0);
  const [cart_id, setCart_id] = useState(0);
  const [product_id, setProduct_id] = useState(0);
  const handleDeleteCartItem = async (id) => {
    try {
      const res = await api().delete(`/cart/delete`, {
        params: { user_id: userSelector.id, id },
      });
      alert(res.data.message);
      getcart();
    } catch (error) {
      console.log("Error deleting cart item:", error);
    }
  };
  const editCartItem = async (qty) => {
    try {
      console.log(qty, product_id, cart_id);
      await api().patch(`/cart/update/${cart_id}`, {
        qty: qty,
        product_id: product_id,
      });
      setCart_id(0);
      setProduct_id(0);
      getcart();
    } catch (error) {
      console.log("Error edit", error);
    }
  };
  async function getcart() {
    console.log(userSelector.id);
    const res = await api().get(`/cart/` + userSelector.id);
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
      <Navbar cart={product} />
      <Center mb={10}>
        <Center mt={"80px"} display={"flex"} flexDir={"column"}>
          <Box fontSize={"30px"} fontWeight={"bold"} fontFamily={"monospace"}>
            CART
          </Box>
          <hr
            style={{
              border: "1px solid #323232",
              width: "1300px",
              marginTop: "30px",
            }}
          />
          {product &&
            product?.map((val) => (
              <Flex alignItems={"center"} width={"1300px"} gap={"30px"}>
                <Flex>
                  <Box>
                    <Image
                      width={"300px"}
                      h={"300px"}
                      src={`${process.env.REACT_APP_API_BASE_URL}/${val.product.product_images[0].product_image}`}
                    />
                  </Box>
                  <Box display={"flex"} alignItems={"center"} gap={"60px"}>
                    <Box w={"250px"}>{val.product.product_name}</Box>
                    <Input
                      type="number"
                      defaultValue={val.qty}
                      min={1}
                      max={stock}
                      w={"70px"}
                      onChange={(e) => {
                        if (e.target.value && e.target.value != "") {
                          val.qty = e.target.value;
                          editCartItem(val.qty);
                        }
                      }}
                      onClick={() => {
                        console.log(val.product_id);
                        setCart_id(val.id);
                        setProduct_id(val.product_id);
                      }}
                    ></Input>{" "}
                    <Box>X</Box>
                    <Box fontWeight={"bold"} fontSize={"17px"} w={"150px"}>
                      Rp{" "}
                      {val.product.price
                        ? val.product.price.toLocaleString("id-ID")
                        : "Price Not Available"}
                      ,00
                    </Box>
                    <Box fontWeight={"bold"} fontSize={"17px"} w={"150px"}>
                      Rp{" "}
                      {val.subtotal
                        ? val.subtotal.toLocaleString("id-ID")
                        : "Price Not Available"}
                      ,00
                    </Box>
                    <Box>
                      <Icon
                        as={AiOutlineDelete}
                        h={"20px"}
                        w={"20px"}
                        cursor={"pointer"}
                        ml={"30px"}
                        onClick={() => {
                          handleDeleteCartItem(val.id);
                        }}
                      />
                    </Box>
                  </Box>
                </Flex>
              </Flex>
            ))}
          <hr
            style={{
              border: "1px solid #323232",
              width: "1300px",
              marginTop: "30px",
            }}
          />
          <Box
            display={"flex"}
            mt={"30px"}
            w={"1000px"}
            gap={"30px"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box>Total order (tax included)</Box>
            <Box fontWeight={"bold"} fontSize={"20px"}>
              Rp{" "}
              {subTotal
                ? subTotal.toLocaleString("id-ID")
                : "Price Not Available"}
              ,00
            </Box>
          </Box>
          <Box
            w={"1000px"}
            display={"flex"}
            mt={"50px"}
            justifyContent={"space-between"}
          >
            <Box>
              <Link to={`/collection`}>
                <Button w={"200px"} bgColor={"#ffe401"} borderRadius={"none"}>
                  Continue shopping
                </Button>
              </Link>
            </Box>
            <Box>
              <Link to={`/checkout`}>
                <Button w={"200px"} bgColor={"#ffe401"} borderRadius={"none"}>
                  Checkout
                </Button>
              </Link>
            </Box>
          </Box>
        </Center>
      </Center>
      <Footer />
    </>
  );
}
