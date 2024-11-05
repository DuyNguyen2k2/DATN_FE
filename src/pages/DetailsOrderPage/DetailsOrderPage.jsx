import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
// import { convertPrice } from "../../utils";
import { useLocation, useParams } from "react-router-dom";
import * as OrderServives from "../../services/OrderServices";
// import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Loading } from "../../components/LoadingComponent/Loading";
import { orderContant } from "../../../contant";
import { convertPrice } from "../../utils";

export const DetailsOrderPage = () => {
  // const user = useSelector((state) => state.user);
  const location = useLocation();
  const { state } = location;
  const params = useParams();
  const { id } = params;
  const fetchDetailsOrder = async () => {
    const res = await OrderServives.getOrderDetails(state?.token, id);
    console.log("API response:", res);
    return res.data;
  };

  const queryDetailsOrder = useQuery(["order-details"], fetchDetailsOrder, {
    enabled: !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { isLoading, data } = queryDetailsOrder;

  const totalAmount = data?.orderItems?.reduce((total, item) => {
    const itemTotal = item.price * item.amount * (1 - (item.discount / 100 || 0));
    return total + itemTotal;
  }, 0) || 0;

  console.log("data", data);

  console.log("params", params);
  console.log("state", state);
  return (
    <Loading isLoading={isLoading}>
      <div className="container-2xl bg-[#fff8f8] min-h-[100vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-2 w-full truncate">
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: <HomeOutlined />,
                },
                {
                  title: "Chi tiết đơn hàng",
                },
              ]}
            />
          </div>

          {/* Thông tin 3 cột */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Địa chỉ người nhận */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Địa chỉ người nhận</h3>
              <p className="text-gray-600 font-bold text-lg">
                {data?.shippingAddress?.fullName}
              </p>
              <p className="text-gray-600">
                {" "}
                <b>Địa chỉ:</b>{" "}
                {data?.shippingAddress?.address +
                  " " +
                  data?.shippingAddress?.commune +
                  " " +
                  data?.shippingAddress?.district +
                  " " +
                  data?.shippingAddress?.city}
              </p>
              <p className="text-gray-600">
                {" "}
                <b>SĐT:</b> {data?.shippingAddress?.phone}
              </p>
            </div>

            {/* Hình thức giao hàng */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Hình thức giao hàng</h3>
              <span className="text-yellow-500 font-semibold text-xl">FAST {" "}</span>
              <span>Giao hàng tiết kiệm</span>
              <p>Phí giao hàng: <b><i>{convertPrice(data.shippingPrice)}</i></b></p>
            </div>

            {/* Hình thức thanh toán */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Hình thức thanh toán</h3>
              <p>
                {orderContant.payment[data?.paymentMethod]}
              </p>
              <p className="text-yellow-500">{!data?.isPaid ? "Chưa thanh toán" : "Đã thanh toán"}</p>
            </div>
          </div>

          {/* Chi tiết sản phẩm trong đơn hàng dưới dạng bảng */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">Chi tiết đơn hàng</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Sản phẩm</th>
                    <th className="border px-4 py-2 text-center">Ảnh</th>
                    <th className="border px-4 py-2 text-center">Số lượng</th>
                    <th className="border px-4 py-2 text-center">Giá</th>
                    <th className="border px-4 py-2 text-center">Giảm giá</th>
                    <th className="border px-4 py-2 text-center">Tạm tính</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.orderItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      {/* Tên sản phẩm */}
                      <td className="border px-4 py-2">{item.name}</td>

                      {/* Ảnh sản phẩm */}
                      <td className="border px-4 py-2 text-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[50px] h-[50px] object-cover rounded-md"
                        />
                      </td>

                      {/* Số lượng */}
                      <td className="border px-4 py-2 text-center">
                        {item.amount}
                      </td>

                      {/* Giá */}
                      <td className="border px-4 py-2 text-center">
                        {convertPrice(item.price)}
                      </td>

                      {/* Giảm giá */}
                      <td className="border px-4 py-2 text-center">
                        {item.discount ? `${item.discount}%` : "Không có"}
                      </td>

                      {/* Tạm tính */}
                      <td className="border px-4 py-2 text-center">
                        {convertPrice(
                          item.price *
                            item.amount *
                            (1 - (item.discount / 100 || 0))
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Thông tin tổng kết */}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Phí vận chuyển:</span>
                <span>{convertPrice(data?.shippingPrice)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span>{convertPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-gray-800">
                <span>Tổng cộng:</span>
                <span>{convertPrice(totalAmount + data?.shippingPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};
