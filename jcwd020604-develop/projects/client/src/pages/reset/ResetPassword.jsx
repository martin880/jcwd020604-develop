import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    useColorModeValue,
    FormErrorMessage,
    useToast,
    Text
  } from '@chakra-ui/react';
import {api} from "../../api/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
  
  export default function ResetPassword() {
    const toast = useToast({ position: "top" });
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth);
  
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
        await resetPassword(values);
      },
    });

    const resetPassword = async (values) => {
      try {
        await api().post(`/password/reset-password`, values);
        toast({
          title: "Verification password has been sent to your email",
          status: "success",
          duration: 3000,
          position: 'top',
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Failed to send verification password",
          status: "error",
          duration: 3000,
          position: 'top',
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
                      Reset Password
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
                      Reset Password
                    </Button>
                    <Text
                    color={'blue.600'}
                    _hover={{textColor: 'blue.400'}}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'} 
                    cursor={'pointer'} onClick={() => navigate("/")}>Cancel</Text>
                  </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }