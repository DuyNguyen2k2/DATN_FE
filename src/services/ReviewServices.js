import { axiosJWT } from "./UserServices";

const BE_URL = import.meta.env.VITE_API_URL;

/**
 * Lấy danh sách review theo query
 * @param {string} access_token - JWT token
 * @param {object} query - Query params (page, limit, product_id, user_id, etc.)
 * @returns {Promise} - API response
 */
export const getReviews = async (access_token, query = {}) => {
  const queryParams = new URLSearchParams(query).toString();
  const res = await axiosJWT.get(`${BE_URL}/review/getAll?${queryParams}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
  // const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // return sortedData;
};

/**
 * Tạo mới một review
 * @param {string} access_token - JWT token
 * @param {object} data - Review data (product_id, user_id, rating, content, images)
 * @returns {Promise} - API response
 */
export const createReview = async (access_token, data) => {
  const res = await axiosJWT.post(`${BE_URL}/review/createReview`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

/**
 * Cập nhật một review
 * @param {string} access_token - JWT token
 * @param {string} id - ID của review cần cập nhật
 * @param {object} data - Dữ liệu cần cập nhật (rating, content, images, etc.)
 * @returns {Promise} - API response
 */
export const updateReview = async (access_token, id, data) => {
  const res = await axiosJWT.put(`${BE_URL}/review/updateReview/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

/**
 * Xóa một review
 * @param {string} access_token - JWT token
 * @param {string} id - ID của review cần xóa
 * @returns {Promise} - API response
 */
export const deleteReview = async (access_token, id) => {
  const res = await axiosJWT.delete(`${BE_URL}/review/deleteReview/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

/**
 * Lấy thông tin chi tiết của một review
 * @param {string} access_token - JWT token
 * @param {string} id - ID của review
 * @returns {Promise} - API response
 */
export const getReviewDetails = async (access_token, id) => {
  const res = await axiosJWT.get(`${BE_URL}/review/getOneReview/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
