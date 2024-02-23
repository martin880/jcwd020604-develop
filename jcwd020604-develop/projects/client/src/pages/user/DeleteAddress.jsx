import {
    Modal, 
    ModalContent, 
    ModalHeader,
    ModalBody,
    Button,
    useToast,
    HStack
} from '@chakra-ui/react';
import React,{useState} from 'react';
import { api } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteAddress = (props) => {
    const toast = useToast();
    const {addressId} = useParams();
    const [deleteMessage, setDeleteMessage] = useState('');
    const [address, setAddress] = useState({
      address: "",
      province: "",
      city: "",
      district: ""
    });

    const navigate = useNavigate();

    const Close = () => {
      props.setAddressId(null);
      props.onClose();
    }

    const handleDelete = async () => {
    try {
      const response = await api().delete(`/address/${props.addressId}`);
      setDeleteMessage(response.data.message);
      toast({
        title: "Delete address success",
        status: "success",
        duration: 3000,
        isClosable: false,
        position: 'top'
      });
      props.getAddressByUser();
      Close();
      navigate("/user_profile");
    } catch (error) {
      setDeleteMessage('Error deleting address.');
    }
  };

    return (
        <>
        <Modal isOpen={props.isOpen}>
        <ModalContent>
            <ModalHeader>Delete Address</ModalHeader>
            <ModalBody pb={6}>
              <HStack>
                <Button colorScheme='red' size={'xs'} onClick={handleDelete}>Delete</Button>
                <Button colorScheme='yellow' size={'xs'} onClick={Close}>Cancel</Button>
              </HStack>
            </ModalBody>
        </ModalContent>'
        </Modal>
        </>
    );
}

export default DeleteAddress;
