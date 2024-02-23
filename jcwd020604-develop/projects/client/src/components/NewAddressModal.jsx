import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  Input,
  Modal,
  Button,
  useToast,
  Select,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function AddressUser(props) {
  const user = useSelector((state) => state.auth);
  const [address, setAddress] = useState({
    address: "",
    province: "",
    city: "",
    district: "",
  });
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    getAddressByUser();
  }, []);

  useEffect(() => {
    getUserCity();
    getUserProvince();
  }, []);

  const Close = () => {
    props.setAddressId(null);
  };

  const getUserCity = async () => {
    const res = await api().get("/address/getAll/city");
    setCity(res.data);
  };

  const getUserProvince = async () => {
    const res = await api().get("/address/getAll/province");
    setProvince(res.data);
  };

  const saveAddress = async () => {
    try {
      await api().post("/address/users", {
        ...address,
        user_id: user.id,
      });
      toast({
        title: "Address addedd",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
      props.getAddressByUser();
      props.onClose();
      navigate("/checkout");
      Close();
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
      console.log(error);
    }
  };

  const getAddressByUser = async () => {
    try {
      const response = await api().get(`/address/users/${user.id}`);
      setAddress(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching user details",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(address);
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          <ModalHeader textAlign={"center"} fontWeight={"bold"}>
            Add Address
          </ModalHeader>
          <ModalCloseButton />
          <hr />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <Box>Address</Box>
              <Input
                borderRadius={"none"}
                type="text"
                name="address"
                onChange={(val) => handleInputChange(val)}
              />
            </FormControl>
            <FormControl isRequired>
              <Box>District</Box>
              <Input
                borderRadius={"none"}
                type="text"
                name="district"
                onChange={(val) => handleInputChange(val)}
                placeholder="District"
              />
            </FormControl>
            <FormControl isRequired>
              <Box>Province</Box>
              <Select
                borderRadius={"none"}
                name="province"
                onChange={(val) => handleInputChange(val)}
              >
                {province.length
                  ? province.map((val) => (
                      <option value={val.province}>{val.province}</option>
                    ))
                  : null}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <Box>City</Box>
              <Select
                borderRadius={"none"}
                name="city"
                onChange={(val) => handleInputChange(val)}
              >
                {city.length
                  ? city.map((val) => (
                      <option value={val.city_name}>{val.city_name}</option>
                    ))
                  : null}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              color={"b"}
              size={"sm"}
              onClick={props.onClose}
              borderRadius={"none"}
            >
              Later
            </Button>
            <Button
              borderRadius={"none"}
              bgColor={"yellow"}
              size={"sm"}
              onClick={() => {
                saveAddress();
                props.onClose();
              }}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
