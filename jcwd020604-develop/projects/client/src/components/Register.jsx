import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    FormErrorMessage,
    useToast
  } from '@chakra-ui/react';
import { Link } from "react-router-dom";
import { api } from '../api/api';
import { useFormik } from "formik";
import * as Yup from "yup";
  
  export default function Register() {
    const toast = useToast({ position: "top" });
  
    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .email(
          "* This email is invalid. Make sure it's written like example@email.com"
        )
        .required("* Email is required"),
    });
  
    const formik = useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        await register(values);
      },
    });

    const register = async (values) => {
      try {
        await api().post("/authentication/register", values);
        toast({
          title: "Check your email verification",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Failed to send email verification",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
  
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <form onSubmit={formik.handleSubmit}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                      Sign up
                    </Heading>
                </Stack>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input type="email"
                    placeholder='Email'
                    id='email'
                    name='email' 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}/>
                  </FormControl>
                  <Box h={"20px"}>
                    <FormErrorMessage fontSize={"2xs"}>
                      {formik.errors.email}
                    </FormErrorMessage>
                  </Box>
                  <Stack spacing={10} pt={2}>
                    <Button
                      loadingText="Submitting"
                      size="lg"
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }} type="submit">
                      Sign up
                    </Button>
                  </Stack>
                  <Stack pt={4}>
                    <Text align={'center'}>
                      Already a user? 
                      <Link to={'/login'}>
                        <Text cursor={'pointer'} textColor={'blue.500'} _hover={{textColor: 'blue.600'}}
                        >Login</Text>
                      </Link>
                      <Text>or</Text>
                      <Link to={'/'}>
                        <Text cursor={'pointer'} textColor={'yellow.500'} _hover={{textColor: 'yellow.600'}}
                        >Cancel ?</Text>
                      </Link>
                    </Text>
                  </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }