/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Breadcrumb, Button, Col, Image, InputNumber, notification, Rate, Row } from "antd";
import { HomeOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import productImage from "../../assets/images/Iphone13.webp";
import { ButtonComponent } from "../ButtonComponent/ButtonComponent";
import * as ProductServices from "../../services/ProductServices";
import { useQuery } from "react-query";
import { Loading } from "../LoadingComponent/Loading";
import { useEffect, useState } from "react";
import './style.css'; // Ensure this is included
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slices/orderSlice";
import { convertPrice } from "../../utils";

export const ProductDetailsComponent = ({ idProduct }) => {
  const order = useSelector((state) => state.order)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const fetchGetData = async (context) => {
    const id = context.queryKey && context.queryKey[1];
    if (id) {
      const res = await ProductServices.getOneProduct(id);
      return res.data;
    }
  };


  const { isLoading, data: productDetails } = useQuery(
    ["productDetails", idProduct],
    fetchGetData,
    { enabled: !!idProduct }
  );

  // console.log('productDetails', productDetails)

  const [numProducts, setNumProducts] = useState(1);
  const user = useSelector((state) => state.user)

  const onChange = (value) => {
    setNumProducts(Number(value));
  };

  const increment = () => {
    setNumProducts((prev) => {
      const newValue = prev + 1;
      onChange(newValue);
      return newValue;
    });
  };

  const decrement = () => {
    setNumProducts((prev) => {
      const newValue = Math.max(1, prev - 1);
      onChange(newValue);
      return newValue;
    });
  };
  const handleAddOrderProduct = () => {
    if(!user?.id) {
      navigate('/sign-in', {state: location?.pathname})
    }else{
      if(order?.isSuccess) {
        notification.open({
          message: "Thêm vào giỏ hàng thành công",
          type: "success",
        });
        dispatch(addOrderProduct({
          orderItem:{
            name: productDetails?.name,
            amount: numProducts,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInStock: productDetails?.countInStock,
          }
        }))
      }
      
    }
  }
  // console.log('product details', productDetails, user)
  const changAddress = () => {
    navigate('/user-profile')
  }

  useEffect(() => {
    console.log('Order state:', order);
    
  })

  return (
    <div className="container mx-auto px-2">
      <Loading isLoading={isLoading}>
        {productDetails && (
          <>
            <div className="py-2  w-full truncate">
              <Breadcrumb
                items={[
                  {
                    href: "/",
                    title: <HomeOutlined />,
                  },
                  {
                    title: productDetails.name,
                  },
                ]}
              />
            </div>
            <Row className="bg-[#fff] mt-2 rounded-md p-5 hidden sm:flex">
              <Col span={10} className="border-r">
                <Image src={productDetails.image} preview={false} />
                <div className="flex">
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                </div>
              </Col>
              <Col span={14}>
                <div className="p-3 rounded">
                  <p className="text-2xl font-semibold break-words">
                    {productDetails.name}
                  </p>
                  <div className="mt-2">
                    <Rate allowHalf disabled defaultValue={productDetails.rating} />
                    <span> ( Xem 5 đánh giá ) </span>
                    <span> | </span>
                    <span>Đã bán 34</span>
                  </div>
                  <div className="bg-[#FAFAFA] rounded font-bold text-2xl p-3 mt-5">
                    <p>{convertPrice(productDetails?.price)} </p>
                  </div>
                  <div className="text-md border-t mt-5">
                    <div className="mt-3">
                      <span>Giao đến: </span>
                      <span className="underline font-semibold text-lg">
                        {`${user?.address +", "+user?.commune+", "+user?.district+", "+user?.city}`} 
                      </span>
                      <span> - </span>
                      <span onClick={changAddress} className="text-blue-400 font-semibold cursor-pointer hover:underline">
                        Đổi địa chỉ
                      </span>
                    </div>
                  </div>
                  <div className="m-5 border-b border-t">
                    <p className="text-lg mt-5">Số Lượng</p>
                    <div className="mt-2 flex items-center mb-5">
                      <Button onClick={decrement} className="custom-button"><MinusOutlined /></Button>
                      <InputNumber
                        onChange={onChange}
                        value={numProducts}
                        min={1}
                        className="rounded custom-input-number"
                      />
                      <Button onClick={increment} className="custom-button"><PlusOutlined /></Button>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-5">
                    <ButtonComponent
                      className="rounded w-[200px]"
                      danger
                      type="primary"
                      textButton="Chọn Mua"
                      size="large"
                      onClick={handleAddOrderProduct}
                    />
                    <ButtonComponent
                      className="rounded w-[200px]"
                      textButton="Mua Trước Trả Sau"
                      size="large"
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="bg-[#fff] mt-2 rounded-md p-5 sm:hidden block">
              <Col span={24} className="border-b">
                <Image src={productDetails.image} preview={false} />
                <div className="flex">
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                </div>
              </Col>
              <Col span={24}>
                <div className="p-3 rounded">
                  <p className="text-2xl font-semibold break-words">
                    {productDetails.name}
                  </p>
                  <div className="mt-2">
                    <Rate allowHalf disabled defaultValue={productDetails.rating} />
                    <span> ( Xem 5 đánh giá ) </span>
                    <span> | </span>
                    <span>Đã bán 34</span>
                  </div>
                  <div className="bg-[#FAFAFA] rounded font-bold text-2xl p-3 mt-5">
                    <p>{productDetails.price.toLocaleString()} đ</p>
                  </div>
                  <div className="text-md border-t mt-5">
                    <div className="mt-3">
                      <span>Giao đến </span>
                      <span className="underline font-semibold">
                        {user?.address}
                      </span>
                      <span> - </span>
                      <span className="text-blue-400 font-semibold">
                        Đổi địa chỉ
                      </span>
                    </div>
                  </div>
                  <div className="m-5 border-b border-t">
                    <p className="text-lg mt-5">Số Lượng</p>
                    <div className="mt-2 flex items-center mb-5">
                      <Button onClick={decrement} className="custom-button"><MinusOutlined /></Button>
                      <InputNumber
                        onChange={onChange}
                        value={numProducts}
                        min={1}
                        className="rounded custom-input-number"
                      />
                      <Button onClick={increment} className="custom-button"><PlusOutlined /></Button>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-5">
                    <ButtonComponent
                      className="rounded w-[200px]"
                      danger
                      type="primary"
                      textButton="Chọn Mua"
                      size="large"
                    />
                    <ButtonComponent
                      className="rounded w-[200px]"
                      textButton="Mua Trước Trả Sau"
                      size="large"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Loading>
    </div>
  );
};
