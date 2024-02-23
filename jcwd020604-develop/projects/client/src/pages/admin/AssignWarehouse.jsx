import React,{useState, useEffect} from 'react';
import { api } from '../../api/api';
import { 
  FormControl, 
  FormLabel, 
  Modal, 
  Button, 
  Select, 
  ModalHeader, 
  ModalContent, 
  ModalCloseButton, 
  ModalBody,
  useToast, 
  ModalFooter, } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function Assign (props) {
  const [warehouse, setWarehouse] = useState([]);
  const [wAdmin, setWAdmin] = useState({warehouse_id: ""});
  const toast = useToast();
  const nav = useNavigate();

    async function getWarehouse() {
      try {
        const res = await api().get("/warehouse");
        if (res && res.data) {
          setWarehouse(res.data);
        }
      } catch (error) {
        toast({
          title: "Can't get warehouse",
          status: 'warning',
          duration: 3000,
          position: 'top',
          isClosable: false
        });
      }
    };

    const assignUser = async () => {
      try {
        await api().post("/warehouse/assign", {...wAdmin, uuid: props.uuid});
        toast({
          title: "Assign admin success",
          status: "success",
          duration: 3000,
          position: 'top',
          isClosable: false
        });
        nav('/user_list');
        props.fetchData();
        props.onClose();
      } catch (error) {
        toast({
          title: "User is already assigned to another warehouse",
          status: 'warning',
          duration: 3000,
          position: 'top',
          isClosable: false
        });
        props.onClose();
        props.fetchData();
      }
    }

    useEffect(() => {
      getWarehouse();
      if (props.uuid){}
    },[props.uuid]);

    function handleInputChange(e) {
      const { id, value } = e.target;
      const temp = { ...wAdmin };
      temp[id] = value;
      setWAdmin(temp);
  }
  
    return (
      <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
            <ModalHeader>Assign Warehouse Admin</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <FormControl isRequired>
                    <FormLabel>Warehouse</FormLabel>
                    <Select id='warehouse_id' name='warehouse' placeholder='Select warehouse' onClick={handleInputChange}>
                        {warehouse.length? warehouse.map((val) => (
                            <option key={val.id} value={val.id}>{val.warehouse_name}</option>
                        )) : null}
                    </Select>
                </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={assignUser}>
                Save
              </Button>
              <Button colorScheme='orange' onClick={props.onClose}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
      </>
    );
  };
  