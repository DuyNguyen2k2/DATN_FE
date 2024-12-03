/* eslint-disable no-unused-vars */
import axios from "axios";
export const axiosJWT = axios.create();
const BE_URL = import.meta.env.VITE_API_URL;

export const signIn = async (data) => {
  const res = await axios.post(`${BE_URL}/user/sign-in`, data);
  return res.data;
};

export const signUp = async (data) => {
  const res = await axios.post(`${BE_URL}/user/sign-up`, data);
  return res.data;
};

export const getOneUser = async (id, access_token) => {
  const res = await axiosJWT.get(`${BE_URL}/user/getOne/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const getAllUsers = async (access_token) => {
  const res = await axiosJWT.get(`${BE_URL}/user/getAll`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const refreshToken = async () => {
  const res = await axios.post(`${BE_URL}/user/refresh-token`, {
    withCredentials: true,
  });
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${BE_URL}/user/logout`);
  return res.data;
};

export const updateUser = async (id, access_token, data) => {
  console.log('token', access_token)
  const res = await axios.put(`${BE_URL}/user/update-user/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteUser = async (id, access_token) => {
  const res = await axiosJWT.delete(`${BE_URL}/user/delete-user/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteManyUsers = async (ids, access_token) => {
  const res = await axiosJWT.post(`${BE_URL}/user/delete-many`, ids, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const changePassword = async (access_token, data) => {
  const res = await axiosJWT.put(`${BE_URL}/user/change-password`, data,{
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await axiosJWT.post(`${BE_URL}/user/forgot-password`, data);
  return res.data;
};

