
import axios from "axios";

const BE_URL = import.meta.env.VITE_API_URL;

export const getConfig = async () => {
    // console.log('URL', BE_URL)
    const res = await axios.get(`${BE_URL}/payment/config`);
    return res.data;
  };

  
  
  
  