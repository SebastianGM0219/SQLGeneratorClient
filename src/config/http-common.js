import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.145.80:4000/"
});