import axios from "axios";

export default axios.create({
  baseURL: "http://100.27.3.224:4000"
  // baseURL: "https://sql-generator-server.vercel.app/"
});