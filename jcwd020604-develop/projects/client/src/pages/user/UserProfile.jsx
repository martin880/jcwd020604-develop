import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Image,
  Stack,
  useDisclosure,
  useToast,
  Grid,
  GridItem,
  FormHelperText,
} from '@chakra-ui/react';
import {
  MdFacebook,
  MdOutlineEmail,
} from 'react-icons/md';
import { BsGithub, BsDiscord, BsPerson, BsPhone } from 'react-icons/bs';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../api/api';
import Navbar from '../../components/Navbar';
import Loading from '../../components/Loading';
import EditAddressUser from './EditAddressUser';
import AddressUser from './AddressUser';
import DeleteAddress from './DeleteAddress';
import Footer from '../../components/Footer';

export default function UserProfile() {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const editAddressUser = useDisclosure();
  const deleteAddress = useDisclosure();
  const addressUser = useDisclosure();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [fullname, setFullName] = useState(user.fullname);
  const [phone_number, setPhone_Number] = useState(user.phone_number);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user?.address?.address);
  const [changes, setChanges] = useState('');
  const [addressId, setAddressId] = useState('');
  const [users, setUsers] = useState('');

  useEffect(() => {
    if (selectedFile) {
      uploadAvatar();
    }
  }, [selectedFile]);

  useEffect(() => {
    getAddressByUser();
    fetchData();
  }, []);

  const handleFile = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  async function uploadAvatar() {
    const formData = new FormData();
    formData.append("userImg", selectedFile);
  
    try {
      await api().post(`/auth/${user.id}`, formData);
      toast({
        title: "Photo has been updated",
        status: "success",
        duration: 3000,
        position: 'top',
        isClosable: false
      });
      fetchData();
      fetch();
    } catch (error) {
      toast({
        title: "File too large",
        status: "error",
        duration: 3000,
        position: 'top',
        isClosable: false
      });
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);

  const fetchData = async() => {
    try {
      const response = await api().get(`/auth/users/${user.uuid}`);
      setUsers(response.data);
    } catch (error) {
      toast({
            title:"There is something error while executing this command",
            status:"error",
            duration:3000,
            isClosable:false
          });
      }
  }

  async function fetch() {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const user = await api().get("/authentication/v2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
      if (user) {
        dispatch({
          type: "login",
          payload: user,
        });
      }
    } catch (err) {
      toast({
        title: "Error fetching user details",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
    }
  }
      
  const getAddressByUser = async () => {
    try {
      const response = await api().get(`/address/users/${user.id}`);
      setAddress(response.data);
    } catch (error) {
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

  const saveUser = async () => {
    try {
        await api().patch(`/auth/users/${user.uuid}`, changes);
        toast({
            title:"User has been updated",
            status:"success",
            duration:3000,
            isClosable:false
        });
        fetchData();
        fetch();
        navigate("/user_profile");
    } catch (error) {
      toast({
        title:"Failed to update data",
        status:"error",
        duration:3000,
        isClosable:false
    });
    fetchData();
    fetch();
    navigate("/user_profile");
    }
}

const handleInputChange = (e) => {
  const { id, value } = e.target;
  const tempUser = { ...users };
  tempUser[id] = value;
  setChanges(tempUser);
};

  return (
    <>
      <Navbar users={users}/>
      {isLoading ? (
        <Loading />
      ) : (
        <Container maxW="full" centerContent overflow="hidden">
          <form onSubmit={handleSubmit}>
            <Flex>
              <Box
                color="white"
                borderRadius="lg"
                p={{ sm: 5, md: 5, lg: 2 }}
              >
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Heading color={"facebook.600"}>Profile</Heading>
                </Flex>
                <Text
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  mt={{ sm: 3, md: 3, lg: 5 }}
                  color="gray.500"
                >
                  Fill up the form below to update
                </Text>
                <Box p={4}>
                  <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 1 }} justify={{base: 'center'}}>
                    <Flex display={'flex'} justifyContent={{base: 'center', md: 'center', sm: 'center'}}> 
                      <Box h={"100%"} display={'flex'} justifyContent={{base: 'center', md: 'center', sm: 'center'}}>
                          <VStack pl={0} spacing={2} alignItems={"flex-start"}>
                                 <Box bg="white" w={'300px'} borderRadius="lg" alignItems={{base:"flex-start", md: "center", sm: "center"}}>
                                     <Box m={0} color="#0B0E3F" >
                                     <VStack spacing={2} maxW={'300px'}
                                         w={'full'}
                                         bg={'whiteAlpha.200'}
                                         boxShadow={'2xl'}
                                         rounded={'lg'}
                                         overflow={'hidden'}>
                                         <Image
                                         h={'120px'}
                                         w={'full'}
                                         src={'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'}
                                         objectFit={'cover'}
                                         />
                                         <Flex justify={'center'} mt={-12}>
                                         <Avatar
                                             size={'xl'}
                                             src={
                                              `${process.env.REACT_APP_API_BASE_URL}/${users.avatar_url}`
                                             }
                                             alt={'Author'}
                                             css={{
                                             border: '2px solid white',
                                             }}
                                         />
                                         </Flex>
     
                                         <Box p={6}>
                                         <Stack spacing={0} align={'center'} mb={5}>
                                             <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                                             {users.fullname}
                                             </Heading>
                                             <Text color={'gray.500'}>{user.email}</Text>
                                         </Stack>
                                         <Stack direction={'row'} justify={'center'} spacing={6}>
                                             <Stack spacing={0} align={'center'}>
                                             <Text fontWeight={600}>Role</Text>
                                             <Text fontSize={'sm'} color={'gray.500'}>
                                                 {user.role}
                                             </Text>
                                             </Stack>
                                         </Stack>
                                         <Input
                                             accept="image/png, image/jpeg"
                                             ref={inputFileRef}
                                             type="file"
                                             display={"none"}
                                             onChange={handleFile}
                                           />
                                         <Button
                                             w={'full'}
                                             mt={8}
                                             bg={'gray.900'}
                                             color={'white'}
                                             rounded={'md'}
                                             _hover={{
                                             transform: 'translateY(-2px)',
                                             boxShadow: 'lg',
                                             }}
                                             onClick={() => {inputFileRef.current.click(); navigate("/user_profile");}}>
                                             Change Image
                                         </Button>
                                            <HStack
                                                mt={{ lg: 10, md: 10 }}
                                                spacing={5}
                                                px={5}
                                                display={'flex'}
                                                justifyContent={'center'}
                                                alignItems="center">
                                                <IconButton
                                                  aria-label="facebook"
                                                  variant="ghost"
                                                  color={'#97979c'}
                                                  size="lg"
                                                  isRound={true}
                                                  _hover={{ bg: 'white' }}
                                                  icon={<MdFacebook size="28px" />}
                                                />
                                                <IconButton
                                                  aria-label="github"
                                                  variant="ghost"
                                                  color={'#97979c'}
                                                  size="lg"
                                                  isRound={true}
                                                  _hover={{ bg: 'white' }}
                                                  icon={<BsGithub size="28px" />}
                                                />
                                                <IconButton
                                                  aria-label="discord"
                                                  variant="ghost"
                                                  color={'#97979c'}
                                                  size="lg"
                                                  isRound={true}
                                                  _hover={{ bg: 'white' }}
                                                  icon={<BsDiscord size="28px" />}
                                                />
                                          </HStack>
                                         </Box>
                                     </VStack>
                                     </Box>
                                 </Box>
                          </VStack>
                      </Box>
                    </Flex>
                    <WrapItem>
                      <Box bg="white" h={"100%"} borderRadius="lg" boxShadow={"2xl"} overflow={"hidden"}>
                        <Box m={6} color="#0B0E3F">
                            <VStack spacing={5}>
                            <HStack display={{base: 'flex', sm: 'block', md:'flex'}}>
                              <FormControl id="name">
                                  <FormLabel>Your Name</FormLabel>
                                    <InputGroup borderColor="#E0E1E7">
                                        <InputLeftElement pointerEvents="none" children={<BsPerson color="gray.800" />} />
                                        <Input type="text" size="md" id="fullname" value={fullname} onChange={(val) => {handleInputChange(val); setFullName(val.target.value)}}/>
                                    </InputGroup>
                                    <FormHelperText>Max 20 letter.</FormHelperText>
                              </FormControl>
                              <FormControl id="phone_number">
                                    <FormLabel>Phone</FormLabel>
                                      <InputGroup borderColor="#E0E1E7">
                                          <InputLeftElement pointerEvents="none" children={<BsPhone color="gray.800" />} />
                                          <Input type="number" size="md" id="phone_number" value={phone_number} onChange={(val) => {handleInputChange(val); setPhone_Number(val.target.value)}}/>
                                      </InputGroup>
                                      <FormHelperText>Max 12 number.</FormHelperText>
                              </FormControl>                        
                            <FormControl id="email">
                                     <FormLabel>Email</FormLabel>
                                     <InputGroup borderColor="#E0E1E7">
                                       <InputLeftElement
                                         pointerEvents="none"
                                         children={<MdOutlineEmail color="gray.800" />}
                                       />
                                       <Input type="email" size="md" readOnly={true} value={email}/>
                                     </InputGroup>
                                     <FormHelperText>We'll never share your email.</FormHelperText>
                            </FormControl>
                            </HStack>
                              <Box display={'flex'} alignSelf={{base: 'flex', md: 'flex-start', sm: 'block'}}>
                                <Button mr={4} colorScheme={"blue"} w={'70px'} size={"sm"} onClick={() => saveUser()}>
                                  Save
                                </Button>
                              </Box>
                            <FormControl id="address">
                            <FormLabel>
                                <Button variant={'link'} colorScheme={"green"} w={'70px'} size={'sm'} onClick={() => addressUser.onOpen()}>
                                  + Address
                                </Button>
                            </FormLabel>
                            <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                              {address.map((val, idx) => {
                                return (
                                  <>
                                    <GridItem overflow={"hidden"} boxShadow={'md'}
                                      borderRadius={'lg'} p={2} bgColor={'aliceblue'}
                                      key={idx}
                                      >
                                      <Text fontSize={'sm'} textColor={'blackAlpha.700'} fontWeight={'semibold'}>Alamat: {val.address}</Text>
                                      <Text fontSize={'sm'} textColor={'blackAlpha.700'} fontWeight={'semibold'}>Kec/Kota: {val.district}, {val.city}</Text>
                                      <Text fontSize={'sm'} textColor={'blackAlpha.700'} fontWeight={'semibold'}>Provinsi: {val.province}</Text>
                                   
                                    <HStack>
                                    <Flex pl={1}>
                                        <Button
                                         variant={'link'} 
                                         size={'xs'}
                                         colorScheme={'green'}
                                         onClick={() => {setAddressId(val.id); editAddressUser.onOpen();}}
                                         >
                                           Edit
                                        </Button>
                                      </Flex>
                                      <Flex pl={2}>
                                        <Button
                                         variant={'link'} 
                                         size={'xs'}
                                         colorScheme='red'
                                         onClick={() => {deleteAddress.onOpen(); setAddressId(val.id)}}
                                         >
                                           Delete
                                        </Button>
                                      </Flex>
                                    </HStack>
                                    </GridItem>
                                  </>
                                )
                              })}
                            </Grid>
                            </FormControl>
                            </VStack>
                          </Box>
                        </Box>
                      </WrapItem>
                  </Wrap>
                </Box>
                </Box>
              </Flex>
            </form>
          </Container>
        )}
        <EditAddressUser addressId={addressId} setAddressId={setAddressId} isOpen={editAddressUser.isOpen} onClose={editAddressUser.onClose} getAddressByUser={getAddressByUser} />
        <AddressUser isOpen={addressUser.isOpen} onClose={addressUser.onClose} getAddressByUser={getAddressByUser}/>
        <DeleteAddress addressId={addressId} setAddressId={setAddressId} isOpen={deleteAddress.isOpen} onClose={deleteAddress.onClose} getAddressByUser={getAddressByUser}/>
        <Footer/>
      </>
    );
  }