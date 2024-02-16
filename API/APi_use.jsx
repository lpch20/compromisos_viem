import axios from 'axios'

const api = axios.create({
    baseURL: "https://viemventuralink.com.uy/",
    headers: {
      "Content-Type": "application/json",
    },
  });

export default api;