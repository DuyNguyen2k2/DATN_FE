/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { Breadcrumb, Button, Modal, notification, Row } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { Loading } from "../../components/LoadingComponent/Loading";
import * as OrderServives from "../../services/OrderServices";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";

// eslint-disable-next-line react/prop-types
export const MyOrderPage = () => {
  // const user = useSelector((state) => state.user);
  const location = useLocation();
  const { state } = location;
  // console.log('state', state)
  const navigate = useNavigate();
  const fetchMyOrders = async () => {
    const token = state?.token;
    const userId = state?.id;

    if (!token || !userId) {
      throw new Error("Missing access_token or user ID");
    }

    try {
      const res = await OrderServives.getAllOrderDetails(token, userId);
      // console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw new Error("Failed to fetch order details");
    }
  };

  const queryOrders = useQuery(["user-orders"], fetchMyOrders, {
    enabled: !!state?.token && !!state?.id,
    retry: false,
    refetchOnWindowFocus: false,
  });
  // const fetchMyOrders = async () => {
  //   console.log('state1', state)
  //   const res = await OrderServives.getOrderDetails(state?.access_token, state?.id);
  //   return res.data;
  //   // if (!state?.access_token || !state?.id) {
  //   //   throw new Error("Missing access_token or user ID");
  //   // }
  //   // try {
  //   //   const res = await OrderServives.getOrderDetails(state?.access_token, state?.id);
  //   //   return res.data;
  //   // } catch (error) {
  //   //   console.error("Error fetching order details:", error);
  //   //   throw new Error("Failed to fetch order details");
  //   // }
  // };

  // const queryOrders = useQuery(["user-orders"], fetchMyOrders, {
  //   enabled: !!state?.access_token && !!state?.id,
  //   retry: false,
  //   refetchOnWindowFocus: false,
  // });

  const { isLoading, data, isError, error } = queryOrders;
  // console.log("data", data);
  // Tính tổng tiền của các đơn hàng
  const totalAmount =
    data?.reduce((total, order) => {
      const orderTotal = order?.orderItems?.reduce(
        (sum, item) => sum + item.price,
        0
      );
      return total + orderTotal;
    }, 0) || 0;

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { token, id, orderItems } = data;
    const res = OrderServives.cancelOrders(token, id, orderItems);
    return res;
  });

  const handleCancelOrders = (order) => {
    if (!state?.token) {
      console.error("Token is missing in handleCancelOrders");
      return;
    }

    mutation.mutate(
      { token: state.token, id: order._id, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryOrders.refetch();
        },
        onError: (error) => {
          console.error("Error cancelling order:", error);
        },
      }
    );
  };

  const { isLoading: isLoadingCancel, data: dataCancel } = mutation;

  useEffect(() => {
    if (dataCancel?.status === "OK") {
      notification.open({
        message: dataCancel?.message,
        type: "success",
      });
    } else if (dataCancel?.status === "ERR") {
      notification.open({
        message: dataCancel?.message,
        type: "error",
      });
    }
  }, [dataCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      // Calculate total amount for each order
      // console.log("order id", order?._id);
      // console.log('order', order)
      return (
        <>
          {/* Order Item Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center border-t pb-4 mb-4">
            <img
              src={order?.image}
              alt={order?.name}
              className="w-[100px] h-auto sm:w-[120px] object-cover rounded-md border border-gray-200 mt-5"
            />

            {/* Item Details */}
            <div className="flex flex-col justify-between items-center flex-1 w-full sm:w-auto">
              {/* Tên sản phẩm */}
              <span className="text-sm sm:text-lg font-medium text-gray-800 w-full text-center line-clamp-4">
                {order?.name}
              </span>

              {/* Giá */}
              <span className="text-sm sm:text-lg text-center font-semibold text-gray-800 w-full mt-2 block sm:hidden">
                {convertPrice(order?.price)}
              </span>
            </div>

            {/* Giá cho màn hình lớn */}
            <span className="hidden sm:block text-sm sm:text-lg font-semibold text-gray-800 w-1/3 text-center">
              {convertPrice(order?.price)}
            </span>
          </div>
        </>
      );
    });
  };

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <div className="container-2xl bg-[#fff8f8] min-h-[100vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 w-full truncate">
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

          {/* Kiểm tra nếu không có đơn hàng */}
          {data && data.length > 0 ? (
            data.map((order) => {
              const orderTotal = order?.orderItems?.reduce(
                (sum, item) => sum + (item.price || 0), // Đảm bảo item.price hợp lệ
                0
              );
              // console.log('order', order)
              return (
                <div
                  key={order?._id}
                  className="bg-white shadow-[5px_5px_15px_rgba(0,0,0,0.1)] p-4 sm:p-6 rounded-lg transition-shadow duration-300 hover:shadow-[10px_10px_20px_rgba(0,0,0,0.15)] mb-6"
                >
                  {/* Phần trạng thái đơn hàng */}
                  <div className="pb-4 mb-4">
                    <h1 className="font-bold text-base sm:text-lg mb-2 text-gray-800">
                      Trạng thái
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <span>
                        Giao hàng:{" "}
                        <strong className="text-red-500">{order?.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}</strong>
                      </span>
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <span>
                        Thanh toán:{" "}
                        <strong className="text-red-500">
                          {order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </strong>
                      </span>
                    </p>
                  </div>
                  {renderProduct(order?.orderItems)}
                  {/* Các nút hành động */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 mb-5">
                    <span className="text-gray-600 text-xs sm:text-sm">
                      Mã đơn hàng: {order?._id}
                    </span>
                    <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-0">
                      <button
                        onClick={() => handleDetailsOrder(order?._id)}
                        className="bg-blue-600 text-white text-xs sm:text-base py-2 px-3 sm:px-4 rounded-md hover:bg-blue-500 transition"
                      >
                        Xem Chi Tiết
                      </button>
                      {!order?.isDelivered && (
                      <button
                        className="bg-red-600 text-white text-xs sm:text-base py-2 px-3 sm:px-4 rounded-md hover:bg-red-500 transition"
                        onClick={() => handleCancelOrders(order)}
                      >
                        Hủy Đơn Hàng
                      </button>
                    )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t pt-4 mb-4">
                    <span className="text-gray-800 text-base font-bold">
                      Tổng tiền đơn hàng:
                    </span>
                    <span className="text-lg font-semibold text-red-600">
                      {convertPrice(orderTotal)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white shadow-md p-4 rounded-lg mt-6 mb-6 text-center">
              <h2 className="font-bold text-lg text-gray-800">
                Bạn chưa có đơn hàng nào
              </h2>
            </div>
          )}

          {/* Hiển thị tổng tiền */}
          {data && data.length > 0 && (
            <div className="bg-white shadow-md p-4 rounded-lg mt-6 mb-6">
              <h2 className="font-bold text-lg text-gray-800">
                Tổng tiền: {convertPrice(totalAmount)}
              </h2>
            </div>
          )}
        </div>
      </div>
    </Loading>
  );
};
