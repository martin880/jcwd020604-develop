import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Avatar,
  AvatarBadge,
  HStack,
  IconButton,
  Image,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  useToast,
  InputRightElement,
  InputGroup,
  useColorMode,
  Icon,
  VStack,
  Badge,
} from "@chakra-ui/react";
import {
  FiLogOut,
  FiLogIn,
  FiShoppingCart,
  FiSearch,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { BsGlobeAsiaAustralia } from "react-icons/bs";
import "../css/maps.css";
import Logo2 from "../assets/logo2.png";
import { api } from "../api/api";

export default function Navbar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const toast = useToast();
  const inputFileRef = useRef(null);

  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [greeting, setGreeting] = useState("");
  const [totalQty, setTotalQty] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let newGreeting;
    if (currentHour < 12) {
      newGreeting = "Selamat pagi";
    } else if (currentHour < 15) {
      newGreeting = "Selamat siang";
    } else if (currentHour < 18) {
      newGreeting = "Selamat sore";
    } else {
      newGreeting = "Selamat malam";
    }
    setGreeting(newGreeting);
  }, []);

  useEffect(() => {
    getAll();
  }, [search]);

  async function getAll() {
    try {
      setLoading(true);
      const res = await api().get("/product", {
        params: {
          search: search,
        },
      });
      setProduct(res.data.rows);
    } catch (error) {
      setMessage("Error fetching data:", error);
    }
  }

  async function getcart() {
    try {
      const res = await api().get(`/cart/${user.id}`);
      setProduct(res.data);
      let total = 0;
      res.data.forEach((val) => {
        total += val.qty;
      });
      setTotalQty(total);
    } catch (error) {
      setMessage("Error fetching cart data:", error);
    }
  }

  useEffect(() => {
    getcart();
  }, []);

  function logout() {
    localStorage.removeItem("auth");
    dispatch({
      type: "logout",
    });
    navigate("/login");
    toast({
      title: "Anda telah logout",
      status: "success",
      position: "top",
      duration: 3000,
      isClosable: false,
    });
  }

  const handleSearch = (searchValue) => {
    setSearch(searchValue);
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            mr={2}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Image
                src={colorMode === "light" ? Logo : Logo2}
                minW={"50px"}
                w={"20px"}
                cursor={"pointer"}
                onClick={() => navigate("/")}
              ></Image>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {user.role === "ADMIN" ? (
                <>
                  <Flex>
                    <Link to={"/"}>Dashboard</Link>
                  </Flex>
                  <Flex
                    cursor={"pointer"}
                    onClick={() => navigate("/admin/product")}
                  >
                    Products
                  </Flex>
                  <Flex
                    cursor={"pointer"}
                    onClick={() => navigate("/user_list")}
                  >
                    Users
                  </Flex>
                </>
              ) : (
                <>
                  <Flex>
                    <Link to={"/collection"}>Tops</Link>
                  </Flex>
                  <Flex>
                    <Link to={"/collection"}>Bottoms</Link>
                  </Flex>
                  <Flex>
                    <Link to={"/collection"}>Headwear</Link>
                  </Flex>
                  <Flex>
                    <Link to={"/collection"}>Accerories</Link>
                  </Flex>
                </>
              )}
              <Flex justifyContent={"center"}>
                <InputGroup>
                  <InputRightElement cursor={"pointer"}>
                    <FiSearch
                      color="gray.300"
                      onClick={() => handleSearch(inputFileRef.current.value)}
                    />
                  </InputRightElement>
                  <Input
                    ref={inputFileRef}
                    type="text"
                    placeholder="Cari produk..."
                    onChange={(e) => handleSearch(e.target.value)}
                  ></Input>
                </InputGroup>
              </Flex>
              {user.role === "ADMIN" || user.role === "W_ADMIN" ? 
                <Badge variant='outline' colorScheme='green'><Text as={"b"} fontSize={{ base: "8px", sm: "10px", md: "10px" }}>{user.role}</Text>
              </Badge> : null}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <IconButton
              icon={colorMode === "light" ? <FiSun /> : <FiMoon />}
              isRound={"true"}
              size={"sm"}
              m={2}
              alignSelf={"flex-end"}
              onClick={toggleColorMode}
            ></IconButton>
            <Box className="hover-container" mr={4} mt={"5px"}>
              <Link to={`/maps`}>
                <Icon className="hover-icon" as={BsGlobeAsiaAustralia} />
                <Flex
                  className="hover-text"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Store map
                </Flex>
              </Link>
            </Box>
            {user.role === "ADMIN" || user.role === "W_ADMIN" ? null : (
              <>
                <Link to={"/cart"}>
                  <Box m={2} pr={4} cursor={"pointer"}>
                    <FiShoppingCart />
                  </Box>
                </Link>
                <Box
                  ml={"-5"}
                  mr={"20px"}
                  fontWeight={"bold"}
                  rounded={"full"}
                  h={5}
                  w={5}
                  color={"black"}
                  bgColor={"yellow"}
                  display={totalQty === 0 ? "none" : "box"}
                >
                  <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    h={5}
                    w={5}
                    fontSize={"x-small"}
                  >
                    {totalQty}
                  </Flex>
                </Box>
              </>
            )}

            <Menu>
              {user.fullname ? (
                <>
                  <Text
                    fontSize={{ base: "8px", sm: "10px", md: "12px" }}
                    mr={2}
                    display={"flex"}
                    flexDir={{ base: "column", sm: "column", md: "column" }}
                  >
                    {greeting}
                    <Text
                      as={"b"}
                      fontSize={{ base: "8px", sm: "10px", md: "12px" }}
                    >
                      {user.fullname.length > 18
                        ? user.fullname.substring(0, 18) + "..."
                        : user.fullname}
                    </Text>
                  </Text>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                      <Avatar size={"sm"} src={`${process.env.REACT_APP_API_BASE_URL}/${user.avatar_url}`}>
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </Avatar>
                  </MenuButton>
                  <MenuList>
                    {user.role === "ADMIN" ? (
                      <>
                        <MenuItem onClick={() => navigate("/user_list")}>
                          Manage User
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem onClick={() => navigate("/user_profile")}>
                          Manage Profile
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/order")}>
                          My Order List
                        </MenuItem>
                      </>
                    )}
                    {user.role === "ADMIN" || user.role === "W_ADMIN" ? (
                      <>
                        <MenuItem onClick={() => navigate("/admin/managedata")}>
                          Manage Data
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/admin_order")}>
                          Manage Order
                        </MenuItem>
                      </>
                    ) : null}
                  </MenuList>
                  <Link to={"/"}>
                    <Button
                      onClick={logout}
                      size={"sm"}
                      variant={"ghost"}
                      leftIcon={<FiLogOut />}
                      fontSize={"xs"}
                      _hover={{ color: "red" }}
                    >
                      Logout
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {" "}
                  <Link to={"/login"}>
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      leftIcon={<FiLogIn />}
                    >
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {user.role === "ADMIN" ? (
                <>
                  <InputGroup>
                    <InputRightElement cursor={"pointer"}>
                      <FiSearch
                        color="gray.300"
                        onClick={() => handleSearch(inputFileRef.current.value)}
                      />
                    </InputRightElement>
                    <Input
                      ref={inputFileRef}
                      type="text"
                      placeholder="Cari produk..."
                      onChange={(e) => handleSearch(e.target.value)}
                    ></Input>
                  </InputGroup>
                  <Flex>
                    <Link to={"/"}>Dashboard</Link>
                  </Flex>
                  <Flex
                    cursor={"pointer"}
                    onClick={() => navigate("/admin/product")}
                  >
                    Products
                  </Flex>
                  <Flex
                    cursor={"pointer"}
                    onClick={() => navigate("/user_list")}
                  >
                    Users
                  </Flex>
                </>
              ) : (
                <>
                  <InputGroup>
                    <InputRightElement cursor={"pointer"}>
                      <FiSearch
                        color="gray.300"
                        onClick={() => handleSearch(inputFileRef.current.value)}
                      />
                    </InputRightElement>
                    <Input
                      ref={inputFileRef}
                      type="text"
                      placeholder="Cari produk..."
                      onChange={(e) => handleSearch(e.target.value)}
                    ></Input>
                  </InputGroup>
                  <Flex>
                    <Link to={"/collection"}>Tops</Link>
                  </Flex>
                  <Flex>
                    <Link to={"/collection"}>Bottoms</Link>
                  </Flex>
                  <Flex>
                    <Link to={"/collection"}>Headwear</Link>
                  </Flex>
                  <Flex>
                    <Link to={"/collection"}>Accerories</Link>
                  </Flex>
                  <Box></Box>
                </>
              )}
            </Stack>
            {user.role === "ADMIN" || user.role === "W_ADMIN" ? 
            <Badge variant='outline' colorScheme='green'><Text as={"b"} fontSize={{ base: "8px", sm: "10px", md: "10px" }}>{user.role}</Text>
            </Badge> : null}
          </Box>
        ) : null}
      </Box>
      <VStack
        overflow={"clip"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        position={"relative"}
      >
        {search ? (
          <>
            {product?.map((val) => (
              <Flex key={val.uuid}>
                <Text fontSize={"xs"} mx={2}>
                  {val.product_name}
                </Text>
                <Link to={`/collection/${val.uuid}`}>
                  <Text fontSize={"xs"} fontWeight={"bold"} color={"green"}>
                    Lihat Produk
                  </Text>
                </Link>
              </Flex>
            ))}
          </>
        ) : null}
      </VStack>
    </>
  );
}
