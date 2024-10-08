/* eslint-disable no-unused-vars */
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Image,
  InputNumber,
  Modal,
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
import {increAmount, decreAmount, removeOrderProduct, selectedOrder, removeAllOrderProduct} from "../../redux/slices/orderSlice"

// eslint-disable-next-line react/prop-types
export const OrderPage = ({ count = 1 }) => {
  const order = useSelector((state) => state.order);
  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();
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

  const handleChangeCount = (type, idProduct) => {
    // console.log('hande change count', type, idProduct, order.orderItemSelected);
    
    if(type === 'increment'){
      dispatch(increAmount({idProduct}))
    }else{
      dispatch(decreAmount({idProduct}))
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  }
  const handleDeleteAllOrder = () => {
    if(listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  }

  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked){
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked);
    }else{
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

  // console.log("order", typeof order?.orderItemSelected);
  // const totalPrice =  order.orderItem.reduce((total, item) => {
  //   return total + item.price * item.amount;
  // }, 0);

  const tempPrice = useMemo(() => {
    const selectedItems = Array.isArray(order?.orderItemSelected) ? order?.orderItemSelected : [];
    const result = selectedItems?.reduce((total, item) => {
      return total + item.price * item.amount;
      }, 0);
      if (Number(result)) {
      return result;
    }
    return Number(result) || 0;
  }, [order]);

  const discountOrder = useMemo(() => {
    const selectedItems = Array.isArray(order?.orderItemSelected) ? order?.orderItemSelected : [];
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
      return 0;
    } else if (tempPrice === 0) {
      return 0
    }

    // Nếu tổng tiền dưới ngưỡng miễn phí, áp dụng phí giao hàng cố định
    return fixedDeliveryFee;
  }, [tempPrice]);
  // Cập nhật tổng tiền vào order
  const totalPrice = useMemo(() => {
    return Number(tempPrice) - Number(discountOrder) + Number(deliveryPrice);
  }, [tempPrice, discountOrder, discountOrder]);

  const showDeleteConfirm = (idProduct) => {
    Modal.confirm({
      title: "Bạn có chắc chắn xóa đồ này không",
      icon: <DeleteOutlined />,
      content: "Không thể hoàn tác hành động này.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteOrder(idProduct); // Call the delete function on confirmation
      },
      onCancel() {
        console.log("Canceled");
      },
    });
  };

  return (
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
                title: "Giỏ hàng",
              },
            ]}
          />
        </div>
        <div className="">
          <Row>
            <Col span={18} className="px-5">
              {/* Header Section */}
              <div className="header flex justify-between items-center bg-white p-3 rounded-md">
                {/* CheckAll Section */}
                <div className="flex items-center checkAll">
                  <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked.length === order?.orderItems?.length}></Checkbox>
                  <span className="ml-2">Tất cả ({order?.orderItem?.length} sản phẩm)</span>
                </div>

                {/* Columns Section */}
                <div className="flex flex-1 justify-between items-center columns">
                  <span className="w-1/4 text-center">Tên sản phẩm</span>
                  <span className="w-1/4 text-center">Đơn giá</span>
                  <span className="w-1/4 text-center">Số lượng</span>
                  <span className="w-1/4 text-center">Thành tiền</span>
                  <DeleteOutlined style={{ cursor: "pointer" }} onClick={handleDeleteAllOrder} />
                </div>
              </div>

              {/* List Product Section */}
              {order?.orderItems?.map((order) => {
                // console.log("checkOrder", order);
                return (
                  <>
                    <div className="list-product flex justify-between items-center bg-white p-3 rounded-md">
                      {/* CheckAll Section */}
                      <div className="flex items-center gap-4">
                        <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                        <img
                          src={order?.image}
                          alt=""
                          className="w-[120px] h-auto object-cover"
                        />
                      </div>

                      {/* Columns Section */}
                      <div className="flex flex-1 justify-between items-center columns">
                        <span className="w-1/4 text-center">{order?.name}</span>
                        <span className="w-1/4 text-center">
                          {convertPrice(order?.price)}
                        </span>
                        <div className="w-1/4 mt-2 flex items-center justify-center mb-5">
                          <Button
                            onClick={() => handleChangeCount("decrement", order?.product)}
                            className="custom-button"
                          >
                            <MinusOutlined />
                          </Button>
                          <InputNumber
                            onChange={onChange}
                            value={order?.amount}
                            min={1}
                            className="rounded custom-input-number w-[50px]"
                          />
                          <Button
                            onClick={() => handleChangeCount("increment", order?.product)}
                            className="custom-button"
                          >
                            <PlusOutlined />
                          </Button>
                        </div>

                        <span className="w-1/4 text-center">
                          {convertPrice(order?.price * order?.amount)}
                        </span>
                        <DeleteOutlined style={{ cursor: "pointer" }} onClick={() => showDeleteConfirm(order?.product)}/>
                      </div>
                    </div>
                  </>
                );
              })}
            </Col>

            <Col span={6} className=" w-[100px]">
              <div className="bg-white p-5 rounded-md">
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
              <div className="flex justify-center my-10">
                <ButtonComponent
                  className="rounded w-[200px]"
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
