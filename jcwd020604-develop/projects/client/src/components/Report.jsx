import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { api } from "../api/api";
import moment from "moment";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
Chart.register(...registerables);

export default function SalesReport() {
  const warehouses = ["MMS Batam", "MMS Yogyakarta", "MMS Jakarta"];
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);
  const [date, setDate] = useState({
    dateFrom: "",
    dateTo: "",
  });
  const [message, setMessage] = useState("");
  const [dataReport, setDataReport] = useState([]);
  const [dataReportChart, setDataReportChart] = useState([]);
  async function getData() {
    const data = {
      dateFrom: date.dateFrom
        ? date.dateFrom
        : moment().subtract(1, "months").format("YYYY-MM-DD"),
      dateTo: date.dateFrom ? date.dateFrom : moment().format("YYYY-MM-DD"),
    };
    try {
      const res = await api().post(`/report/report`, data);
      setDataReport(res.data.data);
    } catch (error) {
      setMessage(error);
    }
  }

  useEffect(() => {
    getData();

    if (dataReport) {
      setDataReportChart(dataReport);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Box mt={"30px"} mb={"50px"}>
        <Box p={4}>
          <Box mb={4}>
            <Select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse} value={warehouse}>
                  {warehouse}
                </option>
              ))}
            </Select>
          </Box>

          <Flex w={"100%"} justifyContent={"center"}>
            <OrderCategoryChart dataReport={dataReport} />
          </Flex>

          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>no</Th>
                <Th>Date</Th>
                <Th>Product Name</Th>
                <Th>Category</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataReport.map((val, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{val.createdAt.split("T")[0]}</Td>
                  <Td>{val.stock.product.product_name}</Td>
                  <Td>{val.stock.product.category.category_name}</Td>
                  <Td>{val.stock.product.price}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button mt={4} colorScheme="pink">
            Export Report
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

const OrderCategoryChart = (props) => {
  const dataReport = props.dataReport || [];

  const categoryCounts = {};
  dataReport?.forEach((order) => {
    const product = order.stock.product;
    if (product) {
      const category = product.category;
      const categoryName = category.category_name; // Ubah properti sesuai struktur Anda
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    }
  });

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Jumlah Produk",
        data: Object.values(categoryCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};
