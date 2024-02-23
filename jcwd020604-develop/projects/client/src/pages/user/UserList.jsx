import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Button,
    Tr,
    Th,
    Td,
    TableContainer,
    ButtonGroup,
    Text,
    Stack,
    HStack,
    useToast,
    useDisclosure,
    Spacer
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import EditUser from './EditUser';
import AssignWarehouse from "../admin/AssignWarehouse";
import Navbar from '../../components/Navbar';
import Footer from "../../components/Footer";

const UserList = () => {
    const editUser = useDisclosure();
    const assignUser = useDisclosure();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();
    const { role = "W_ADMIN" } = useParams();
    const [adminId, setAdminId] = useState();
    
    useEffect(() => {
     fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api().get(`/auth/users/role/${role}`);
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
    
    const deleteUser = async(id) => {
        try {
            await api().delete(`/auth/users/role/${role}/${id}`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            toast({
                title:"User has been deleted",
                status:"success",
                duration:3000,
                isClosable:false
            });
            fetchData();
        } catch (error) {
            toast({
                title:"There is something error while executing this command",
                status:"error",
                duration:3000,
                isClosable:false
            });
        }
    }

    return (
        <>
        <Navbar/>
        <Stack>
            <HStack>
               <ButtonGroup m={2}>
                    <Button onClick={() => navigate('/add_user')} fontSize={'xs'} colorScheme={'messenger'} size={'xs'}>Add Users</Button>
                    <Button colorScheme={'messenger'} size={'xs'} fontSize={'xs'} cursor={'pointer'} onClick={() => navigate("/admin/manageData")}>Manage Data</Button>
                    <Button colorScheme={'messenger'} size={'xs'} fontSize={'xs'}cursor={'pointer'} onClick={() => navigate("/")}>Back to home</Button>
               </ButtonGroup>
            </HStack>
        </Stack>
            <TableContainer>
                <Table variant={'simple'} size={'sm'} bgColor={'twitter.200'}>
                    <Thead>
                    <Tr>
                        <Th textColor={'blackAlpha.700'}>No</Th>
                        <Th textColor={'blackAlpha.700'}>Name</Th>
                        <Th textColor={'blackAlpha.700'}>Email</Th>
                        <Th textColor={'blackAlpha.700'}>Phone</Th>
                        <Th textColor={'blackAlpha.700'}>Role</Th>
                        <Th textColor={'blackAlpha.700'}>Warehouse</Th>
                        <Th display={'flex'} justifyContent={'center'} textColor={'blackAlpha.700'}>Action</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user, index) => (
                        <Tr key={user.uuid}>
                            <Td textColor={'blackAlpha.700'}>{index + 1}</Td>
                            <Td textColor={'blackAlpha.700'} fontWeight={'semibold'}>{user.fullname}</Td>
                            <Td textColor={'blackAlpha.700'} fontWeight={'semibold'}>{user.email}</Td>
                            <Td><Text fontSize={'sm'} textColor={'blackAlpha.700'} fontWeight={'semibold'}>{user.phone_number}</Text></Td>
                            <Td><Text fontFamily={'sans-serif'} textColor={'blackAlpha.700'} fontWeight={'semibold'} fontSize={'xs'}>{user.role}</Text></Td>
                            <Td><Text fontFamily={'sans-serif'} textColor={'blackAlpha.700'} fontSize={'xs'} fontWeight={'semibold'}>{user?.warehouse?.warehouse_name}</Text></Td>
                            <Td>
                                <ButtonGroup display={'flex'} justifyContent={'center'}>
                                    <Button colorScheme={'green'} fontSize={'xs'} size={'xs'} onClick={()=> {editUser.onOpen();setAdminId(user.uuid)} }>Edit</Button>
                                    <Button colorScheme={'facebook'} fontSize={'xs'} size={'xs'} onClick={() => {assignUser.onOpen();setAdminId(user.uuid)}}>Assign</Button>
                                    <Button colorScheme={'red'} fontSize={'xs'} size={'xs'} onClick={() => {deleteUser(user.uuid); navigate("/user_list")}}>Delete</Button>
                                </ButtonGroup>
                            </Td>
                        </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <EditUser uuid={adminId} isOpen={editUser.isOpen} onClose={editUser.onClose} fetchData={fetchData}/>
            <AssignWarehouse uuid={adminId} isOpen={assignUser.isOpen} onClose={assignUser.onClose} fetchData={fetchData}/>
            <Spacer/>
            <Footer/>
        </>
    );
}

export default UserList;
