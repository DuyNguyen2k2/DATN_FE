/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Breadcrumb, Col, notification, Row } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { ButtonComponent } from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";

import { convertPrice } from "../../utils";
import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderServices from "../../services/OrderServices";
import { Loading } from "../../components/LoadingComponent/Loading";

// eslint-disable-next-line react/prop-types
export const PaymentPage = ({ count = 1 }) => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stateUserDetails, setstateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    commune: "",
  });
  // console.log("order", typeof order?.orderItemSelected);
  // const totalPrice =  order.orderItem.reduce((total, item) => {
  //   return total + item.price * item.amount;
  // }, 0);

  const tempPrice = useMemo(() => {
    const selectedItems = Array.isArray(order?.orderItemSelected)
      ? order?.orderItemSelected
      : [];
    const result = selectedItems?.reduce((total, item) => {
      return total + item.price * item.amount;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return Number(result) || 0;
  }, [order]);

  const discountOrder = useMemo(() => {
    const selectedItems = Array.isArray(order?.orderItemSelected)
      ? order?.orderItemSelected
      : [];
    const result = selectedItems?.reduce((total, item) => {
      return total + item.discount * item.amount;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return Number(result) || 0;
  }, [order]);
  const deliveryPrice = useMemo(() => {
    const fixedDeliveryFee = 20000; // Mức phí giao hàng cố định
    const freeDeliveryThreshold = 300000; // Ngưỡng miễn phí giao hàng

    // Nếu tổng tiền lớn hơn ngưỡng miễn phí, không tính phí giao hàng
    if (tempPrice >= freeDeliveryThreshold) {
      return 10000;
    } else if (tempPrice === 0) {
      return 0;
    }

    // Nếu tổng tiền dưới ngưỡng miễn phí, áp dụng phí giao hàng cố định
    return fixedDeliveryFee;
  }, [tempPrice]);
  // Cập nhật tổng tiền vào order
  const totalPrice = useMemo(() => {
    return Number(tempPrice) - Number(discountOrder) + Number(deliveryPrice);
  }, [tempPrice, discountOrder, discountOrder]);

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemSelected &&
      user?.name &&
      user?.address &&
      user?.city &&
      user?.district &&
      user?.commune &&
      user?.phone &&
      user?.id &&
      tempPrice
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemSelected,
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        district: user?.district,
        commune: user?.commune,
        phone: user?.phone,
        paymentMethod: payment,
        itemsPrice: tempPrice,
        shippingPrice: deliveryPrice,
        totalPrice: totalPrice,
        user: user?.id,
      })
    }
  };

  console.log("order", order, user);

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderServices.createOrder(token, { ...rests });
    return res;
  });

  const { isLoading, data } = mutationAddOrder;

  const changAddress = () => {
    navigate("/user-profile");
  };

  useEffect(() => {
    setstateUserDetails({
      ...stateUserDetails,
      name: user?.name,
      phone: user?.phone,
      address: user?.address,
      city: user?.city,
      district: user?.district,
      commune: user?.commune,
    });
  }, [user]);
  console.log("state user details", stateUserDetails);

  useEffect(() => {
    if(data?.status === 'OK'){
      notification.success({
        message:"Thành công",
      });
    }else if(data?.status === 'ERR'){
      notification.error({
        message: "Không thành công",
      });
    }
  }, [data])

  return (
    <div className="container-2xl bg-[#fff8f8] h-[100vh]">
      <Loading isLoading={isLoading}>
        <div className="container mx-auto">
          <div className="py-2  w-full truncate">
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: <HomeOutlined />,
                },
                {
                  title: "Giỏ hàng",
                },
              ]}
            />
          </div>
          <div className="">
            <Row>
              <Col span={18} className="px-5">
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-4">
                    Chọn phương thức giao hàng
                  </h3>
                  <div className="flex items-center mb-3">
                    <input
                      type="radio"
                      id="delivery-fast"
                      name="delivery"
                      checked={delivery === 'fast'}
                      value="fast"
                      className="mr-2"
                    />
                    <label
                      htmlFor="delivery-fast"
                      className="text-yellow-500 font-semibold"
                    >
                      FAST
                    </label>
                    <span className="ml-2 text-gray-600">
                      Giao hàng tiết kiệm
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="delivery-gojek"
                      name="delivery"
                      checked={delivery === 'gojek'}
                      value="gojek"
                      className="mr-2"
                    />
                    <label
                      htmlFor="delivery-gojek"
                      className="text-yellow-500 font-semibold"
                    >
                      GO_JEK
                    </label>
                    <span className="ml-2 text-gray-600">
                      Giao hàng tiết kiệm
                    </span>
                  </div>
                </div>

                {/* Chọn phương thức thanh toán */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg mb-4">
                    Chọn phương thức thanh toán
                  </h3>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payment-cod"
                      name="payment"
                      checked={payment === 'later_money'}
                      value="later_money"
                      className="mr-2"
                    />
                    <label
                      htmlFor="payment-cod"
                      className="text-blue-600 font-semibold"
                    >
                      Thanh toán tiền mặt khi nhận hàng
                    </label>
                  </div>
                </div>
              </Col>

              <Col span={6} className=" w-[100px]">
                <div className="bg-white p-5 rounded-md">
                  <div className="mb-3">
                    <span>Giao đến: </span>
                    <span className="underline font-semibold text-lg">
                      {`${
                        user?.address +
                        ", " +
                        user?.commune +
                        ", " +
                        user?.district +
                        ", " +
                        user?.city
                      }`}
                    </span>
                    <span> - </span>
                    <span
                      onClick={changAddress}
                      className="text-blue-400 font-semibold cursor-pointer hover:underline"
                    >
                      Đổi địa chỉ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p>Tạm tính</p>
                    <p>{convertPrice(tempPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Giảm giá</p>
                    <p>{discountOrder}%</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Thuế</p>
                    <p>0</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Phí giao hàng</p>
                    <p>{convertPrice(deliveryPrice)}</p>
                  </div>
                  <div className="flex justify-between mt-10">
                    <p className="text-lg font-bold">Tổng tiền</p>
                    <div className="flex flex-col">
                      <p className="font-bold text-red-500 text-lg">
                        {convertPrice(totalPrice)}
                      </p>
                      <p className="text-sm">(Dã bao gồm VAT nếu có)</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center my-10 ">
                  <ButtonComponent
                    onClick={() => handleAddOrder()}
                    className="rounded w-full"
                    danger
                    type="primary"
                    textButton="Đặt Hàng"
                    size="large"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Loading>
    </div>
  );
};