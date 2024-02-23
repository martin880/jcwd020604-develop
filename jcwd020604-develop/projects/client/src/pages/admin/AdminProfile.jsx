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
    Textarea,
    Avatar,
    Image,
    Stack,
    useColorModeValue,
    ButtonGroup,
  } from '@chakra-ui/react';
  import {
    MdFacebook,
    MdOutlineEmail,
  } from 'react-icons/md';
  import { BsGithub, BsDiscord, BsPerson } from 'react-icons/bs';
  import { useNavigate } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  
  export default function UserProfile() {
    const user = useSelector((state) => state.auth);
    const navigate = useNavigate();
    return (
      <Container bg="#9DC4FB" maxW="full" mt={0} centerContent overflow="hidden">
        <Flex>
          <Box
            bg="#02054B"
            color="white"
            borderRadius="lg"
            m={{ sm: 4, md: 16, lg: 10 }}
            p={{ sm: 5, md: 5, lg: 16 }}>
                <Flex justifyContent={'center'} alignItems={'center'}>
                    <Heading>Profile</Heading>
                </Flex>
                <Text display={'flex'} justifyContent={'center'} alignItems={'center'} mt={{ sm: 3, md: 3, lg: 5 }} color="gray.500">
                    Fill up the form below to update
                </Text>
            <Box p={4}>
              <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
                <WrapItem>
                  <Box>
                      <VStack pl={0} spacing={2} alignItems="flex-start">
                        <Box bg="white" w={'300px'} borderRadius="lg">
                            <Box m={0} color="#0B0E3F">
                            <VStack spacing={2} maxW={'300px'}
                                w={'full'}
                                bg={useColorModeValue('white', 'gray.800')}
                                boxShadow={'2xl'}
                                rounded={'lg'}
                                overflow={'hidden'}>
                                <Image
                                h={'120px'}
                                w={'full'}
                                src={
                                    'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
                                }
                                objectFit={'cover'}
                                />
                                <Flex justify={'center'} mt={-12}>
                                <Avatar
                                    size={'xl'}
                                    src={
                                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
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
                                    {user.fullname}
                                    </Heading>
                                    <Text color={'gray.500'}>{user.email}</Text>
                                </Stack>

                                <Stack direction={'row'} justify={'center'} spacing={6}>
                                    <Stack spacing={0} align={'center'}>
                                    <Text fontWeight={600}>23k</Text>
                                    <Text fontSize={'sm'} color={'gray.500'}>
                                        Followers
                                    </Text>
                                    </Stack>
                                    <Stack spacing={0} align={'center'}>
                                    <Text fontWeight={600}>23k</Text>
                                    <Text fontSize={'sm'} color={'gray.500'}>
                                        Followers
                                    </Text>
                                    </Stack>
                                </Stack>

                                <Button
                                    w={'full'}
                                    mt={8}
                                    bg={useColorModeValue('#151f21', 'gray.900')}
                                    color={'white'}
                                    rounded={'md'}
                                    _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg',
                                    }}>
                                    Change Image
                                </Button>
                                </Box>
                            </VStack>
                            </Box>
                        </Box>
                      </VStack>
                    <Box py={{ base: 4, sm: 5, md: 8, lg: 10 }}>
                    </Box>
                    <HStack
                      mt={{ lg: 10, md: 10 }}
                      spacing={5}
                      px={5}
                      alignItems="flex-start">
                      <IconButton
                        aria-label="facebook"
                        variant="ghost"
                        color={'white'}
                        size="lg"
                        isRound={true}
                        _hover={{ bg: '#0D74FF' }}
                        icon={<MdFacebook size="28px" />}
                      />
                      <IconButton
                        aria-label="github"
                        variant="ghost"
                        color={'white'}
                        size="lg"
                        isRound={true}
                        _hover={{ bg: '#0D74FF' }}
                        icon={<BsGithub size="28px" />}
                      />
                      <IconButton
                        aria-label="discord"
                        variant="ghost"
                        color={'white'}
                        size="lg"
                        isRound={true}
                        _hover={{ bg: '#0D74FF' }}
                        icon={<BsDiscord size="28px" />}
                      />
                    </HStack>
                  </Box>
                </WrapItem>
                <WrapItem>
                  <Box bg="white" borderRadius="lg">
                    <Box m={8} color="#0B0E3F">
                      <VStack spacing={5}>
                        <FormControl id="name">
                          <FormLabel>Your Name</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement
                              pointerEvents="none"
                              children={<BsPerson color="gray.800" />}
                            />
                            <Input type="text" size="md" placeholder={user.fullname}/>
                          </InputGroup>
                        </FormControl>
                        <FormControl id="email">
                          <FormLabel>Email</FormLabel>
                          <InputGroup borderColor="#E0E1E7">
                            <InputLeftElement
                              pointerEvents="none"
                              children={<MdOutlineEmail color="gray.800" />}
                            />
                            <Input type="email" readOnly={true} size="md" placeholder={user.email}/>
                          </InputGroup>
                        </FormControl>
                        <FormControl id="name">
                          <FormLabel>Address</FormLabel>
                          <Textarea
                            borderColor="gray.300"
                            _hover={{
                              borderRadius: 'gray.300',
                            }}
                            placeholder="Changes Address"
                          />
                        </FormControl>
                        <FormControl id="button">
                            <ButtonGroup>
                            <Button
                                variant="solid"
                                bg="#0D74FF"
                                color="white"
                                _hover={{}}>
                                Save
                            </Button>
                            <Button
                                variant="solid"
                                bg="#FA8B44"
                                color="white"
                                _hover={{}}
                                onClick={() => navigate("/")}>
                                Cancel
                            </Button>
                            </ButtonGroup>
                        </FormControl>
                      </VStack>
                    </Box>
                  </Box>
                </WrapItem>
              </Wrap>
            </Box>
          </Box>
        </Flex>
      </Container>
    );
  }