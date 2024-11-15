
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

  export const getAllOrderDetails = async (access_token, id) => {
    // console.log('URL', BE_URL)
    const res = await axiosJWT.get(`${BE_URL}/order/getAllOrderDetails/${id}`, {
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

  export const cancelOrders = async (access_token, id, orderItems) => {
    const config = {
      headers: {
        token: `Bearer ${access_token}`, // Đúng chuẩn `Bearer <token>`
      },
      data: orderItems,
    };
  
    // console.log("Cancel Order Request Config:", config); // Log cấu hình để kiểm tra
    const res = await axiosJWT.delete(`${BE_URL}/order/cancel-order/${id}`, config);
    return res.data;
  };
  
  export const getAllOrders = async (access_token) => {
    const res = await axiosJWT.get(`${BE_URL}/order/getAllOrders`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
    return res.data;
  };
  
  