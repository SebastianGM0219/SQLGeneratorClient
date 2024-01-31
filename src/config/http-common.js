import axios from "axios";

export default axios.create({
  baseURL: "https://sql-generator-server-eight.vercel.app/"
});