import { Flex, Box, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from "react-router-dom";
import { api } from '../api/api';
import { useDispatch } from "react-redux";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const nav = useNavigate();

  const handleLogin = async (values) => {
    try {
      const loginResponse = await api().post("/authentication/login", values);
      const token = loginResponse.data.token;
  
      const userDetailsResponse = await api().get("/authentication/v2", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userDetails = userDetailsResponse.data;
  
      localStorage.setItem("auth", JSON.stringify(token));
      dispatch({
        type: "login",
        payload: userDetails,
      });
      toast({
        title: "Welcome",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: false,
      });
      nav("/");
    } catch (err) {
      toast({
        title: "Wrong Email or Password",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: false,
      });
    }
  };
  

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'}>
                Sign In
              </Heading>
            </Stack>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleLogin(values);
              }}
            >
              <Form>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel>Email address</FormLabel>
                      <Input type="email" placeholder="Email" {...field} />
                      <ErrorMessage name="email" component={Text} color="red.500" />
                    </FormControl>
                  )}
                </Field>
                <Field name="password">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password}>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          {...field}
                        />
                        <InputRightElement h={'full'}>
                          <Button
                            variant={'ghost'}
                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <ErrorMessage name="password" component={Text} color="red.500" />
                    </FormControl>
                  )}
                </Field>
                <Stack spacing={4} mt={4}>
                  <Button
                    type="submit"
                    isLoading={Formik.isSubmitting}
                    loadingText="Submitting"
                    size="lg"
                    w={'100%'}
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Sign In
                  </Button>
                  <Link to={'/register'}>
                    <Button
                      loadingText="Submitting"
                      size="lg"
                      w={'100%'}
                      bg={'green.400'}
                      color={'white'}
                      _hover={{
                        bg: 'green.500',
                      }}
                    >
                      Register
                    </Button>
                  </Link>
                  <Link to={'/reset_password'}>
                      <Text cursor={'pointer'} display={'flex'} alignItems={'center'} justifyContent={'center'} textColor={'green.500'} _hover={{textColor: 'green.600'}}>
                        Forgot Password
                      </Text>
                    </Link>
                  <Text align={'center'}>
                    Back to 
                    <Link to={'/'}>
                      <Text cursor={'pointer'} textColor={'blue.500'} _hover={{textColor: 'blue.600'}}>
                        Homepage
                      </Text>
                    </Link>
                  </Text>
                </Stack>
              </Form>
            </Formik>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
