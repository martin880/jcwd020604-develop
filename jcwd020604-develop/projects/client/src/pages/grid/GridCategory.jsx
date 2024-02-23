import React from 'react';
import { Box, Grid, GridItem, Text, VStack, Flex } from '@chakra-ui/react';
import {RiTShirt2Line} from "react-icons/ri";
import {PiPants} from "react-icons/pi";
import {FaRedhat} from "react-icons/fa";
import {BsHandbag} from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const GridCategory = () => {
    const navigate = useNavigate();
    return (
        <>
            <Grid templateColumns={{base:'repeat(2, 1fr)', md: 'repeat(4, 1fr)', sm: 'repeat(4, 1fr)'}} gap={0}>
                <GridItem w='100%' h='120' border={'1px solid gray'}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} p={4} cursor={'pointer'} onClick={() => navigate('/collection')}>
                        <VStack>
                            <RiTShirt2Line size={'50px'}/>
                                <Text fontSize={'16px'} fontWeight={'bold'}>
                                    TOPS
                                </Text>
                        </VStack>
                    </Box>
                </GridItem>
                <GridItem w='100%' h='120' border={'1px solid gray'}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} p={4} cursor={'pointer'} onClick={() => navigate('/collection')}>
                        <VStack>
                            <PiPants size={'50px'}/>
                                <Text fontSize={'16px'} fontWeight={'bold'}>
                                    BOTTOMS
                                </Text>
                        </VStack>
                    </Box>
                </GridItem>
                <GridItem w='100%' h='120' border={'1px solid gray'}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} p={4} cursor={'pointer'} onClick={() => navigate('/collection')}>
                        <VStack>
                            <FaRedhat size={'50px'}/>
                                <Text fontSize={'16px'} fontWeight={'bold'}>
                                    HEADWEARES
                                </Text>
                        </VStack>
                    </Box>
                </GridItem>
                <GridItem w='100%' h='120' border={'1px solid gray'}>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} p={4} cursor={'pointer'} onClick={() => navigate('/collection')}>
                        <VStack>
                            <BsHandbag size={'50px'}/>
                                <Text fontSize={'16px'} fontWeight={'bold'}>
                                    ACCESORIES
                                </Text>
                        </VStack>
                    </Box>
                </GridItem>
            </Grid>
        </>
    );
}

export default GridCategory;


