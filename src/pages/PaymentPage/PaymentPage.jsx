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
import * as PaymentServices from "../../services/PaymentServices";
import { Loading } from "../../components/LoadingComponent/Loading";
import { removeAllOrderProduct } from "../../redux/slices/orderSlice";
import { PayPalButton } from "react-paypal-button-v2";

// eslint-disable-next-line react/prop-types
export const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);
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
    const freeDeliveryThreshold1 = 300000; // Ngưỡng giảm phí giao hàng
    const freeDeliveryThreshold2 = 500000; // Ngưỡng miễn phí giao hàng

    // Nếu không chọn sản phẩm nào, phí giao hàng là 0
    if (tempPrice === 0) {
      return 0;
    }
    // Nếu tổng tiền trên ngưỡng 500.000, miễn phí giao hàng
    else if (tempPrice > freeDeliveryThreshold2) {
      return 0;
    }
    // Nếu tổng tiền từ 300.001 đến 500.000, phí giao hàng 10.000
    else if (
      tempPrice > freeDeliveryThreshold1 &&
      tempPrice <= freeDeliveryThreshold2
    ) {
      return 10000;
    }
    // Nếu tổng tiền dưới 300.000, phí giao hàng 20.000
    else if (tempPrice > 0) {
      return fixedDeliveryFee;
    }

    return fixedDeliveryFee; // Phí mặc định nếu không có hàng
  }, [tempPrice]);
  // Cập nhật tổng tiền vào order
  const totalPrice = useMemo(() => {
    return (
      Number(tempPrice) -
      Number(tempPrice * (discountOrder / 100)) +
      Number(deliveryPrice)
    );
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
        shippingPrice: Number(deliveryPrice),
        totalPrice: totalPrice,
        user: user?.id,
        email: user?.email,
      });
    }
  };

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
    if (data?.status === "OK") {
      notification.success({
        message: "Đặt hàng thành công",
      });
      const arrayOrdered = [];
      order?.orderItemSelected.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      setTimeout(() => {
        navigate("/orderSuccess", {
          state: {
            delivery,
            payment,
            orders: order?.orderItemSelected,
            totalPrice: totalPrice,
          },
        });
      }, 500);
    } else if (data?.status === "ERR") {
      notification.error({
        message: "Đặt hàng không thành công",
      });
    }
  }, [data]);

  const addPayPalScript = async () => {
    const {data} = await PaymentServices.getConfig()
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `https://sandbox.paypal.com/sdk/js?client-id=${data}`
    script.async = true
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if(!window.paypal) {
      addPayPalScript()
    }else{
      setSdkReady(true)
    }
  }, []);

  const onSuccessPayment = (details, data) => {
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
      shippingPrice: Number(deliveryPrice),
      totalPrice: totalPrice,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
    });
    console.log('details, data', details, data)
  }

  return (
    <div className="container-2xl bg-[#fff8f8] min-h-screen">
      <Loading isLoading={isLoading}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 w-full truncate">
            <Breadcrumb
              items={[
                { href: "/", title: <HomeOutlined /> },
                { title: "Thanh toán" },
              ]}
            />
          </div>
  
          <Row gutter={[16, 16]}>
            {/* Cột chọn phương thức giao hàng và thanh toán */}
            <Col xs={24} md={18} className="px-5">
              <div className="mb-6 p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-4">Chọn phương thức giao hàng</h3>
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    id="delivery-fast"
                    name="delivery"
                    checked={delivery === "fast"}
                    value="fast"
                    className="mr-2 w-6 h-6"
                    onChange={() => setDelivery("fast")}
                  />
                  <label htmlFor="delivery-fast" className="text-yellow-500 font-semibold text-xl">
                    FAST
                  </label>
                  <span className="ml-2 text-gray-600 text-lg sm:text-xl">Giao hàng tiết kiệm</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="delivery-gojek"
                    name="delivery"
                    checked={delivery === "gojek"}
                    value="gojek"
                    className="mr-2 w-6 h-6"
                    onChange={() => setDelivery("gojek")}
                  />
                  <label htmlFor="delivery-gojek" className="text-yellow-500 font-semibold text-xl">
                    GO_JEK
                  </label>
                  <span className="ml-2 text-gray-600 text-lg sm:text-xl">Giao hàng tiết kiệm</span>
                </div>
              </div>
  
              {/* Chọn phương thức thanh toán */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-4">Chọn phương thức thanh toán</h3>
                <div className="flex items-center mb-3">
                  <input
                    type="radio"
                    id="payment-cod"
                    name="payment"
                    checked={payment === "later_money"}
                    value="later_money"
                    className="mr-2 w-6 h-6"
                    onChange={() => setPayment("later_money")}
                  />
                  <label htmlFor="payment-cod" className="text-blue-600 font-semibold text-xl">
                    Thanh toán tiền mặt khi nhận hàng
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-paypal"
                    name="payment"
                    checked={payment === "paypal"}
                    value="paypal"
                    className="mr-2 w-6 h-6"
                    onChange={() => setPayment("paypal")}
                  />
                  <label htmlFor="payment-paypal" className="text-blue-600 font-semibold text-xl">
                    Thanh toán bằng{" "}
                    <i>
                      <b className="text-yellow-600">
                        <span className="font-bold">
                          <span className="text-[#003087]">PAY</span>
                          <span className="text-[#009CDE]">PAL</span>
                        </span>
                      </b>
                    </i>
                  </label>
                </div>
              </div>
            </Col>
  
            {/* Cột thông tin đơn hàng */}
            <Col xs={24} md={6} className="w-full">
              <div className="bg-white p-5 rounded-md mb-4">
                <div className="mb-3">
                  <span>Giao đến: </span>
                  <span className="underline font-semibold text-lg block">
                    {`${user?.address}, ${user?.commune}, ${user?.district}, ${user?.city}`}
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
                    <p className="font-bold text-red-500 text-lg">{convertPrice(totalPrice)}</p>
                    <p className="text-sm">(Đã bao gồm VAT nếu có)</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-10">
                {payment === "paypal" && sdkReady ? (
                  <div className="w-full">
                    <PayPalButton
                      amount={(totalPrice / 25310).toFixed(2)}
                      onSuccess={onSuccessPayment}
                      onError={() => {
                        alert("ERROR");
                      }}
                    />
                  </div>
                ) : (
                  <ButtonComponent
                    onClick={() => handleAddOrder()}
                    disabled={isLoading}
                    className="rounded w-full"
                    danger
                    type="primary"
                    textButton="Đặt Hàng"
                    size="large"
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Loading>
    </div>
  );
  
};
