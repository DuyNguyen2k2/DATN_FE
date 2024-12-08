/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Breadcrumb, Col, notification, Row } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { useSelector } from "react-redux";

import { convertPrice } from "../../utils";

import { Loading } from "../../components/LoadingComponent/Loading";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../../contant";

// eslint-disable-next-line react/prop-types
export const OrderSuccess = ({ count = 1 }) => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const { state } = location;
  // console.log("Location", location);
  return (
    <div className="container-2xl bg-[#fff8f8] min-h-screen mb-5">
      <Loading isLoading={false}>
        <div className="container mx-auto px-4">
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
          <div className="">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} lg={24} className="bg-white">
                <div className="mb-6 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-4">
                    Phương thức giao hàng
                  </h3>
                  <div className="flex items-center mb-3 bg-[rgb(240,248,255)] p-5 w-full sm:w-max border border-solid border-[rgb(194,255,255)] rounded-md">
                    <span className="font-bold text-yellow-500">
                      {orderContant.delivery[state?.delivery]}
                    </span>
                    <span className="ml-2 text-gray-600">
                      Giao hàng tiết kiệm
                    </span>
                  </div>
                </div>

                {/* Phương thức thanh toán */}
                <div className="p-4 border-t rounded-lg">
                  <h3 className="font-medium text-lg mb-4">
                    Phương thức thanh toán
                  </h3>
                  <div className="flex items-center bg-[rgb(240,248,255)] p-5 w-full sm:w-max border border-solid border-[rgb(194,255,255)] rounded-md">
                    <span className="text-blue-600 font-semibold">
                      {orderContant.payment[state?.payment]}
                    </span>
                  </div>
                </div>

                {/* Chi tiết đơn hàng */}
                <div className="header border-t flex justify-between items-center bg-white p-3 rounded-md">
                  <div className="flex flex-wrap justify-between items-center w-full">
                    <span className="w-1/5 text-center hidden sm:block">
                      Ảnh
                    </span>
                    <span className="w-1/5 text-center hidden sm:block">
                      Tên sản phẩm
                    </span>
                    <span className="w-1/5 text-center hidden sm:block">
                      Đơn giá
                    </span>
                    <span className="w-1/5 text-center hidden sm:block">
                      Số lượng
                    </span>
                    <span className="w-1/5 text-center hidden sm:block">
                      Thành tiền
                    </span>
                  </div>
                </div>

                {/* Các sản phẩm trong đơn hàng */}
                {state.orders?.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="p-2 flex flex-wrap justify-between items-center columns bg-white border-b border-gray-200"
                    >
                      <div className="w-full sm:w-1/5 flex justify-center items-center mb-2 sm:mb-0">
                        <img
                          src={order?.image}
                          alt={order?.name}
                          className="w-[100px] h-auto object-cover"
                        />
                      </div>

                      {/* Hiển thị tên cột trên mobile */}
                      <div className="w-full sm:w-1/5 text-center mb-2 sm:mb-0">
                        <div className="block sm:hidden font-semibold">
                          Tên sản phẩm:
                        </div>
                        {order?.name}
                      </div>
                      <div className="w-full sm:w-1/5 text-center mb-2 sm:mb-0">
                        <div className="block sm:hidden font-semibold">
                          Đơn giá:
                        </div>
                        {convertPrice(
                          order?.price - (order?.price * order?.discount) / 100
                        )}
                      </div>
                      <div className="w-full sm:w-1/5 text-center mb-2 sm:mb-0">
                        <div className="block sm:hidden font-semibold">
                          Số lượng:
                        </div>
                        {order?.amount}
                      </div>
                      <div className="w-full sm:w-1/5 text-center mb-2 sm:mb-0">
                        <div className="block sm:hidden font-semibold">
                          Thành tiền:
                        </div>
                        {convertPrice(
                          (order?.price -
                            (order?.price * order?.discount) / 100) *
                            order?.amount
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="p-4 border-t">
                  <span className="text-lg font-bold">
                    Tổng tiền:{" "}
                    <span className="text-red-500">
                      {convertPrice(state?.totalPrice)}
                    </span>
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Loading>
    </div>
  );
};
