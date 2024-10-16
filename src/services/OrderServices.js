
import { axiosJWT } from "./UserServices";

const BE_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (access_token, data) => {
    // console.log('URL', BE_URL)
    const res = await axiosJWT.post(`${BE_URL}/order/create`, data, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  };

  export const getOrderDetails = async (access_token, id) => {
    // console.log('URL', BE_URL)
    const res = await axiosJWT.get(`${BE_URL}/order/getOrderDetails/${id}`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  };