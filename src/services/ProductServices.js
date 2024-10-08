import axios from "axios";
import { axiosJWT } from "./UserServices";

const BE_URL = import.meta.env.VITE_API_URL;

export const getAllProducts = async (search, limit) => {
  let res = {}
  const url = search?.length > 0 
    ? `${BE_URL}/product/getAll?filter=name&filter=${search}&limit=${limit}` 
    : `${BE_URL}/product/getAll?limit=${limit}`;
    
  res = await axios.get(url);
  return res.data;
};

// export const getAllProducts = async (search = "", limit = 10, page = 1) => {
//   const offset = (page - 1) * limit; // Tính toán vị trí bắt đầu
//   const url = search?.length > 0 
//     ? `${BE_URL}/product/getAll?filter=name&filter=${search}&limit=${limit}&offset=${offset}`
//     : `${BE_URL}/product/getAll?limit=${limit}&offset=${offset}`;

//   const res = await axios.get(url);
//   return res.data;
// };


export const getProductsType = async (type, page, limit) => {
    if(type){
      const url =  `${BE_URL}/product/getAll?filter=type&filter=${type}&limit=${limit}&page=${page}` 
      const res = await axios.get(url);
      return res.data;
    }
  
};

export const createProduct = async (data) => {
  const res = await axios.post(`${BE_URL}/product/create`, data);
  return res.data;
};

export const getOneProduct = async (id) => {
  const res = await axios.get(`${BE_URL}/product/getOne/${id}`);
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(`${BE_URL}/product/update/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(`${BE_URL}/product/delete/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteManyProducts = async (ids, access_token) => {
  const res = await axiosJWT.post(`${BE_URL}/product/delete-many`, ids, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getAllType = async () => {
  const res = await axiosJWT.get(`${BE_URL}/product/get-AllType`)
  return res.data;
};