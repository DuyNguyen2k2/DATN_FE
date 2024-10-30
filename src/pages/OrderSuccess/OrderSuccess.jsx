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
  console.log("Location", location);
  return (
    <div className="container-2xl bg-[#fff8f8] h-[100vh]">
      <Loading isLoading={false}>
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
          <div className="">
            <Row>
              <Col span={24} className=" bg-white">
                <div className="mb-6 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-4">
                    Phương thức giao hàng
                  </h3>
                  <div className="flex items-center mb-3 bg-[rgb(240,248,255)] p-5 w-max border border-solid border-[rgb(194,255,255)] rounded-md">
                    <span className="font-bold text-yellow-500">
                      {orderContant.delivery[state?.delivery]}
                    </span>
                    <span className="ml-2 text-gray-600">
                      Giao hàng tiết kiệm
                    </span>
                  </div>
                </div>

                {/* Chọn phương thức thanh toán */}
                <div className="p-4 border-t rounded-lg">
                  <h3 className="font-medium text-lg mb-4">
                    Phương thức thanh toán
                  </h3>
                  <div className="flex items-center bg-[rgb(240,248,255)] p-5 w-max border border-solid border-[rgb(194,255,255)] rounded-md">
                    <span className="text-blue-600 font-semibold">
                      {orderContant.payment[state?.payment]}
                    </span>
                  </div>
                </div>

                <div className="header border-t flex justify-between items-center bg-white p-3 rounded-md">
                  {/* CheckAll Section */}
                  {/* Columns Section */}
                  <div className="flex flex-1 justify-between items-center columns">
                    <span className="w-1/5 text-center">Ảnh</span>
                    <span className="w-1/5 text-center">Tên sản phẩm</span>
                    <span className="w-1/5 text-center">Đơn giá</span>
                    <span className="w-1/5 text-center">Số lượng</span>
                    <span className="w-1/5 text-center">Thành tiền</span>
                  </div>
                </div>
                {/* Columns Section */}
                {state.orders?.map((order) => {
                  return (
                    <>
                      <div className="p-2 flex flex-1 justify-between items-center columns">
                        <div className="w-1/5 flex justify-center items-center">
                          <img
                            src={order?.image}
                            alt={order?.name}
                            className=" w-[100px] h-auto object-cover"
                          />
                        </div>

                        <span className="w-1/5 text-center">{order?.name}</span>
                        <span className="w-1/5 text-center">
                          {convertPrice(order?.price - (order?.price*order?.discount/100))}
                        </span>
                        <span className="w-1/5 text-center">
                          {order?.amount}
                        </span>
                        <span className="w-1/5 text-center">
                          {convertPrice((order?.price - (order?.price*order?.discount/100)) * order?.amount)}
                        </span>
                      </div>
                    </>
                  );
                })}
                <div className="p-4 border-t">
                  <span className="text-lg font-bold">Tổng tiền: <span className="text-red-500">{convertPrice(state?.totalPrice)}</span></span>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Loading>
    </div>
  );
};
