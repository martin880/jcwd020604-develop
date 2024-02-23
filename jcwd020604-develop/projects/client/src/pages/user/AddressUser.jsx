import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
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
import { useSelector } from "react-redux";

export default function AddressUser(props) {
  const user = useSelector((state) => state.auth);
  const [address, setAddress] = useState({
    address: "",
    province: "",
    city: "",
    city_id: "",
    district: "",
  });

  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

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
      await api().post("/insert-address/users", {
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
      navigate("/user_profile");
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

  const handleInputChange = (e) => {
    const { name, value, id } = e.target;
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
          [name]: value,
        }));
      }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalContent>
          <ModalHeader>Add Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                name="address"
                onChange={(val) => handleInputChange(val)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>District</FormLabel>
              <Input
                type="text"
                name="district"
                onChange={(val) => handleInputChange(val)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Province</FormLabel>
              <Select
                name="province"
                onChange={(val) => {handleInputChange(val); setSelectedProvince(val.target.value)}}
              >
                {province.length
                  ? province.map((val) => (
                      <option value={val.province}>{val.province}</option>
                    ))
                  : null}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Select name="city" id="city" onChange={(val) => handleInputChange(val)}>
                {city.length
                  ? city.filter((val) => val.province === selectedProvince).map((val) => (
                      <option
                        key={val.id}
                        value={`${val.city_name}|${val.city_id}`}
                      >
                        {val.city_name}
                      </option>
                    ))
                  : null}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              size={"sm"}
              onClick={() => {
                saveAddress();
                props.onClose();
              }}
            >
              Save
            </Button>
            <Button colorScheme="orange" size={"sm"} onClick={props.onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
