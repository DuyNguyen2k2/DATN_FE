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

// eslint-disable-next-line react/prop-types
export const OrderPage = ({ count = 1 }) => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increment") {
      if (!limited) {
        dispatch(increAmount({ idProduct }));
      } else {
        notification.warning({
          message: "Warning",
          description: "Vượt quá số lượng sản phẩm hiện có",
        });
      }
    } else if (type === "decrement") {
      if (!limited) {
        dispatch(decreAmount({ idProduct }));
      } else {
        notification.warning({
          message: "Warning",
          description: "Sản phẩm đã đạt số lượng tối thiểu",
        });
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };
  const handleDeleteAllOrder = () => {
    if (listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

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

    const result = selectedItems.reduce((total, item) => {
      // Chỉ áp dụng chiết khấu một lần cho mỗi sản phẩm, không phụ thuộc vào số lượng
      return total + item.discount;
    }, 0);

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
  }, [tempPrice, discountOrder, deliveryPrice]);

  const showDeleteConfirm = (idProduct) => {
    Modal.confirm({
      title: "Bạn có chắc chắn xóa sản phẩm này không",
      icon: <DeleteOutlined />,
      content: "Không thể hoàn tác hành động này.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteOrder(idProduct); // Call the delete function on confirmation
      },
    });
  };

  const showDeleteAllConfirm = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn xóa tất cả sản phẩm này không",
      icon: <DeleteOutlined />,
      content: "Không thể hoàn tác hành động này.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteAllOrder(); // Call the delete function on confirmation
      },
    });
  };

  const handleAddToCart = () => {
    if (
      !user?.name ||
      !user?.phone ||
      !user?.address ||
      !user?.city ||
      !user?.district ||
      !user?.commune
    ) {
      notification.warning({
        message: "Thông tin giao hàng chưa đầy đủ",
        description: "Vui lòng nhập đầy đủ thông tin giao hàng trong profile",
        placement: "topRight",
      });
    } else if (!order?.orderItemSelected?.length) {
      notification.warning({
        message: "Chưa có sản phẩm nào được chọn",
        description: "Vui lòng chọn sản phẩm để mua hàng",
        placement: "topRight",
      });
    } else {
      // Kiểm tra sản phẩm vượt quá số lượng tồn kho
      console.log('order', order?.orderItemSelected)
      const exceededProducts = order?.orderItemSelected.filter(
        (item) => item.amount > item.countInStock
      );
  
      if (exceededProducts.length > 0) {
        const productDetails = exceededProducts
          .map(
            (product) =>
              `- ${product.name}: số lượng ${product.amount}, tồn kho ${product.countInStock}`
          )
          .join("\n");
  
        notification.warning({
          message: "Có sản phẩm vượt quá số lượng tồn kho",
          description: (
            <div>
              <p>Vui lòng kiểm tra lại:</p>
              <pre style={{ whiteSpace: "pre-wrap" }}>{productDetails}</pre>
            </div>
          ),
          placement: "topRight",
        });
  
        // Dừng tại đây, không cho phép tiếp tục
        return;
      }
  
      // Chuyển hướng sang trang thanh toán
      navigate("/payment");
    }
  };
  
  

  const changAddress = () => {
    navigate("/user-profile");
  };

  const itemsStep = [
    {
      title: "20.000 VNĐ",
      description: "Dưới 300.000",
    },
    {
      title: "10.000 VNĐ",
      description: "300.001 - 500.000",
    },
    {
      title: "0 VNĐ",
      description: "Trên 500.000",
    },
  ];

  return (
    <div className="container-2xl bg-[#fff8f8] min-h-screen mb-20">
      <div className="container mx-auto">
        <div className="py-2 w-full truncate">
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
          <Row
            gutter={[16, 16]}
            style={{ flexWrap: "wrap" }}
            className="flex flex-wrap"
          >
            <Col xs={24} sm={24} md={18} className="px-5">
              <div className="mb-5 bg-white p-5">
                <StepsComponent
                  items={itemsStep}
                  current={
                    deliveryPrice === 20000
                      ? 0
                      : deliveryPrice === 10000
                      ? 1
                      : order?.orderItemSelected.length === 0
                      ? 0
                      : 2
                  }
                />
              </div>
              {/* Header Section */}
              <div className="header flex flex-wrap items-center bg-white p-3 rounded-md">
                {/* CheckAll Section */}
                <div className="flex items-center w-full sm:w-1/6 justify-start sm:justify-center mb-2 sm:mb-0">
                  <Checkbox
                    onChange={handleOnchangeCheckAll}
                    checked={listChecked.length === order?.orderItems?.length}
                  />
                  <span className="ml-2">
                    Tất cả ({order?.orderItems?.length} sản phẩm)
                  </span>
                </div>

                {/* Columns Section */}
                <div className="hidden sm:flex flex-1 justify-between items-center w-full">
                  <span className="w-1/6 text-center">Tên sản phẩm</span>
                  <span className="w-1/6 text-center">Đơn giá</span>
                  <span className="w-1/6 text-center">Số lượng</span>
                  <span className="w-1/6 text-center">Thành tiền</span>
                  <span className="w-1/6 text-center">
                    <DeleteOutlined
                      style={{ cursor: "pointer" }}
                      onClick={showDeleteAllConfirm}
                    />
                  </span>
                </div>
              </div>

              {/* List Product Section */}
              {order?.orderItems?.map((item) => (
                <div
                  key={item?.product}
                  className="list-product flex flex-wrap items-center bg-white p-3 rounded-md mb-3"
                >
                  {/* Checkbox + Image Section */}
                  <div className="flex items-center gap-4 w-full sm:w-1/6 justify-start sm:justify-center mb-2 sm:mb-0">
                    <Checkbox
                      onChange={onChange}
                      value={item?.product}
                      checked={listChecked.includes(item?.product)}
                    />
                    <img
                      src={item?.image}
                      alt=""
                      className="w-[80px] h-auto object-cover"
                    />
                  </div>

                  {/* Product Name */}
                  <span className="w-full sm:w-1/6 text-left sm:text-center mb-2 sm:mb-0">
                    {item?.name}
                  </span>

                  {/* Unit Price */}
                  <span className="w-full sm:w-1/6 text-left sm:text-center mb-2 sm:mb-0">
                    {convertPrice(item?.price)}
                  </span>

                  {/* Quantity Section */}
                  <div className="w-full sm:w-1/6 flex justify-start sm:justify-center items-center gap-2 mb-2 sm:mb-0">
                    <Button
                      onClick={() =>
                        handleChangeCount(
                          "decrement",
                          item?.product,
                          item?.amount === 1
                        )
                      }
                      className="custom-button"
                    >
                      <MinusOutlined />
                    </Button>
                    <InputNumber
                      onChange={onChange}
                      value={item?.amount}
                      min={1}
                      className="rounded custom-input-number w-[60px]"
                    />
                    <Button
                      onClick={() =>
                        handleChangeCount(
                          "increment",
                          item?.product,
                          item?.amount === item?.countInStock
                        )
                      }
                      className="custom-button"
                    >
                      <PlusOutlined />
                    </Button>
                  </div>

                  {/* Total Price */}
                  <span className="w-full sm:w-1/6 text-left sm:text-center mb-2 sm:mb-0">
                    {convertPrice(item?.price * item?.amount)}
                  </span>

                  {/* Delete Icon */}
                  <span className="w-full sm:w-1/6 flex justify-start sm:justify-center">
                    <DeleteOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() => showDeleteConfirm(item?.product)}
                    />
                  </span>
                </div>
              ))}
            </Col>

            <Col xs={24} sm={24} md={6} className="w-full md:w-[100px]">
              <div className="bg-white p-5 rounded-md">
                <div className="mb-3">
                  <span>Giao đến: </span>
                  <span className="underline font-semibold text-lg">
                    {user?.address &&
                    user?.commune &&
                    user?.district &&
                    user?.city
                      ? `${user?.address}, ${user?.commune}, ${user?.district}, ${user?.city}`
                      : "Chưa có địa chỉ giao hàng"}
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
              <div className="flex justify-center">
                <ButtonComponent
                  onClick={() => handleAddToCart()}
                  className="rounded w-full"
                  danger
                  type="primary"
                  textButton="Chọn Mua"
                  size="large"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
