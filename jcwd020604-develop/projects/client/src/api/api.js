import axios from "axios";

export function api() {
  const token = JSON.parse(localStorage.getItem("auth"));
  const headers = {
    ["x-secret-key"]: process.env.secret_key,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
    headers: headers,
  });
  return api;
}