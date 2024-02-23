import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";
import {
  FaUser,
  FaLock,
} from "react-icons/fa";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { api } from '../api/api';
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import React from "react";

export default function Verify() {
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");
  const toast = useToast({ position: "top" });
  const nav = useNavigate();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [show1, setShow1] = React.useState(false);
  const handleClick1 = () => setShow1(!show1);

  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(6, "Full name min 6 character")
      .required("Name is required"),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(
        /^(?=.*[!@#$%^&*])/,
        "Must contain at least one special character"
      )
      .min(8, "Password minimum 8 character")
      .required("Password is required!"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const formik = useFormik({
    initialValues: {
      fullname: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      verif(values);
    },
  });

  async function verif(values) {
    const { password, fullname } = values;
    try {
      await api().patch(`${process.env.REACT_APP_API_BASE_URL}/authentication/verify`, {
        email,
        password,
        fullname,
      });
      toast({
        title: "Verification successful, now you can login",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      nav("/login");
    } catch (err) {
      toast({
        title: err.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Box
      w={["full", "md"]}
      p={[8, 10]}
      mt={[20, "10vh"]}
      mx={"auto"}
      border={["none", "1px"]}
      borderColor={["", "gray.300"]}
      borderRadius={10}
    >
      <VStack spacing={4} align={"center"} w={"full"}>
        <Heading> Verification </Heading>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <FormControl
            id="fullname"
            mt={"10px"}
            isRequired
            isInvalid={formik.touched.fullname && formik.errors.fullname}
          >
            <InputGroup>
              <InputLeftElement children={<Icon as={FaUser} />} />
              <Input
                type="text"
                placeholder="Full Name"
                id="fullname"
                onChange={formik.handleChange}
                value={formik.values.fullname}
              />
            </InputGroup>
            <Box h={"20px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.fullname}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl
            id="password"
            mt={"10px"}
            isRequired
            isInvalid={formik.touched.password && formik.errors.password}
          >
            <InputGroup>
              <InputLeftElement children={<Icon as={FaLock} />} />
              <Input
                type={show ? "text" : "password"}
                placeholder="Password"
                id="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                  bgColor={"white"}
                  _hover={"white"}
                >
                  {show ? (
                    <Icon as={AiOutlineEye} w={"100%"} h={"100%"}></Icon>
                  ) : (
                    <Icon
                      as={AiOutlineEyeInvisible}
                      w={"100%"}
                      h={"100%"}
                    ></Icon>
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Box h={"20px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.password}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl
            id="confirmPassword"
            mt={"10px"}
            isRequired
            isInvalid={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          >
            <InputGroup>
              <InputLeftElement children={<Icon as={FaLock} />} />
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                id="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />{" "}
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick1}
                  bgColor={"white"}
                  _hover={"white"}
                >
                  {show1 ? (
                    <Icon as={AiOutlineEye} w={"100%"} h={"100%"}></Icon>
                  ) : (
                    <Icon
                      as={AiOutlineEyeInvisible}
                      w={"100%"}
                      h={"100%"}
                    ></Icon>
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Box h={"20px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.confirmPassword}
              </FormErrorMessage>
            </Box>
          </FormControl>
          <Button
            mt={"10px"}
            w={"100%"}
            bg={'blue.400'}
            color={'white'}
              _hover={{
                bg: 'blue.500',
            }}
            size="lg"
            type="submit"
          >
            Verify
          </Button>
        </form>
      </VStack>
    </Box>
  );
}
