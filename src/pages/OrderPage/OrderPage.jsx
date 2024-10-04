/* eslint-disable no-unused-vars */
import { Breadcrumb, Button, Checkbox, Col, Image, InputNumber, Row } from "antd";
import { HomeOutlined, DeleteOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import { ButtonComponent } from "../../components/ButtonComponent/ButtonComponent";
import { useSelector } from "react-redux";
import productImage from "../../assets/images/Iphone13.webp";

// eslint-disable-next-line react/prop-types
export const OrderPage = ({ count = 1 }) => {
  const order = useSelector((state) => state.order);
  const onChange = (e) => {
    console.log(`checked = ${e.target.value}`);
  };

  const handleChangeCount = () => {};

  const handleOnchangeCheckAll = (e) => {};

  console.log("order", order);

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
                  <Checkbox onChange={handleOnchangeCheckAll}></Checkbox>
                  <span className="ml-2">Tất cả (1 sản phẩm)</span>
                </div>

                {/* Columns Section */}
                <div className="flex flex-1 justify-between items-center columns">
                  <span className="w-1/4 text-center">Tên sản phẩm</span>
                  <span className="w-1/4 text-center">Đơn giá</span>
                  <span className="w-1/4 text-center">Số lượng</span>
                  <span className="w-1/4 text-center">Thành tiền</span>
                  <DeleteOutlined style={{ cursor: "pointer" }} />
                </div>
              </div>

              {/* List Product Section */}
              {order?.orderItem?.map((order) => {
                console.log("map", order);
                return (
                  <>
                    <div className="list-product flex justify-between items-center bg-white p-3 rounded-md">
                      {/* CheckAll Section */}
                      <div className="flex items-center gap-4">
                        <Checkbox onChange={handleOnchangeCheckAll}></Checkbox>
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
                          {order?.price.toLocaleString()}
                        </span>
                        <div className="w-1/4 mt-2 flex items-center justify-center mb-5">
                          <Button onClick={() => handleChangeCount('decrement')} className="custom-button">
                            <MinusOutlined />
                          </Button>
                          <InputNumber
                            onChange={onChange}
                            value={order?.amount}
                            min={1}
                            className="rounded custom-input-number w-[50px]"
                          />
                          <Button onClick={() => handleChangeCount('increment')} className="custom-button">
                            <PlusOutlined />
                          </Button>
                        </div>
                        
                        <span className="w-1/4 text-center">{(order?.price * order?.amount).toLocaleString()}</span>
                        <DeleteOutlined style={{ cursor: "pointer" }} />
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
                  <p>0</p>
                </div>
                <div className="flex justify-between">
                  <p>Giảm giá</p>
                  <p>0</p>
                </div>
                <div className="flex justify-between">
                  <p>Thuế</p>
                  <p>0</p>
                </div>
                <div className="flex justify-between">
                  <p>Phí giao hàng</p>
                  <p>0</p>
                </div>
                <div className="flex justify-between mt-10">
                  <p className="text-lg font-bold">Tổng tiền</p>
                  <div className="flex flex-col">
                    <p className="font-bold text-red-500 text-lg">0</p>
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
