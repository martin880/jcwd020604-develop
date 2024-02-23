import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  FormControl,
  FormLabel,
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
} from "@chakra-ui/react";

export default function AddressUser(props) {
  const user = useSelector((state) => state.auth);
  const { id } = useParams();
  const [address, setAddress] = useState({
    address: "",
    province: "",
    city: "",
    city_id: "",
    district: "",
  });
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (props.addressId) {
      getUserCity();
      getUserProvince();
      getAddressByUser();
    }
  }, [props.addressId]);

  const Close = () => {
    props.setAddressId(null);
    props.onClose();
  };

  const getUserCity = async () => {
    const res = await api().get("/address/getAll/city");
    setCity(res.data);
  };

  const getUserProvince = async () => {
    const res = await api().get("/address/getAll/province");
    setProvince(res.data);
  };

  const editAddress = async () => {
    try {
      await api().patch(`/address/${props.addressId}`, address);
      toast({
        title: "Address updated",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
      navigate("/user_profile");
      props.getAddressByUser();
      Close();
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: false,
      });
    }
  };

  const getAddressByUser = async () => {
    try {
      const response = await api().get(`/address/${props.addressId}`);
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

  const handleInputChange = (e) => {
    const { value, id } = e.target;
    if (id === "city") {
      const [selectedCityName, selectedCityId] = value.split("|");
      setAddress((prevState) => ({
        ...prevState,
        city: selectedCityName,
        city_id: selectedCityId,
      }));
    } else {
      setAddress((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };
  
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={Close}>
        <ModalContent>
          <ModalHeader>Add Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                id="address"
                value={address.address}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>District</FormLabel>
              <Input
                type="text"
                id="district"
                value={address.district}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Province</FormLabel>
              <Select id="province" onChange={handleInputChange}>
                {province.length
                  ? province.map((val) =>
                      val.province === address.province ? (
                        <option selected value={val.province}>
                          {val.province}
                        </option>
                      ) : (
                        <option value={val.province}>{val.province}</option>
                      )
                    )
                  : null}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Select
                id="city"
                onChange={handleInputChange}
                value={`${address.city}|${address.city_id}`}
              >
                {city.length &&
                  city.map((val) => (
                    val.province === address.province ? (
                      <option
                        key={val.city_id}
                        value={`${val.city_name}|${val.city_id}`}
                      >
                        {val.city_name}
                      </option>
                    ) : null
                  ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              size={"sm"}
              onClick={() => editAddress()}
            >
              Edit
            </Button>
            <Button colorScheme="orange" size={"sm"} onClick={Close}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
