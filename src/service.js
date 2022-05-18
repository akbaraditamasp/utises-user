import axios from "axios";

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default service;
