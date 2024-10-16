/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Image,
  InputNumber,
  Modal,
  notification,
  Row,
} from "antd";
import {
  HomeOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ButtonComponent } from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import productImage from "../../assets/images/Iphone13.webp";
import { convertPrice } from "../../utils";
import { useEffect, useMemo, useState } from "react";
import {
  increAmount,
  decreAmount,
  removeOrderProduct,
  selectedOrder,
  removeAllOrderProduct,
} from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { StepsComponent } from "../../components/StepsComponent/StepsComponent";
import * as OrderServives from "../../services/OrderServices";
import { useQuery } from "react-query";
import { Loading } from "../../components/LoadingComponent/Loading";

// eslint-disable-next-line react/prop-types
export const MyOrderPage = ({ count = 1 }) => {
  const user = useSelector((state) => state.user);
  const fetchMyOrders = async () => {
    if (!user?.access_token || !user?.id) {
      throw new Error("Missing access_token or user ID");
    }
    try {
      const res = await OrderServives.getOrderDetails(user.access_token, user.id);
      return res.data;
    } catch (error) {
      console.error("Error fetching order details:", error.response?.status, error.message);
      throw new Error("Failed to fetch order details");
    }
  };

  const queryOrders = useQuery(
    ['user-orders', user?.id],
    fetchMyOrders,
    {
      enabled: !!user?.access_token && !!user?.id,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading, data, isError, error, isFetching } = queryOrders;

  // Kiểm tra trạng thái và log khi dữ liệu đã sẵn sàng
  useEffect(() => {
    if (!isLoading && data) {
      console.log("Fetched data:", data);
    }
  }, [isLoading, data]);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Loading isLoading={isLoading}>
      <div className="container-2xl bg-[#fff8f8] h-[100vh]">
        <div className="container mx-auto">
          <div className="py-2  w-full truncate">
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: <HomeOutlined />,
                },
                {
                  title: "Đơn hàng",
                },
              ]}
            />
          </div>
          My order
        </div>
      </div>
    </Loading>
  );
};
