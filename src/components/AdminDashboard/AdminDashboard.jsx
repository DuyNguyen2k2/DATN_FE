/* eslint-disable no-unused-vars */

import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PieChart, Pie } from "recharts";
import * as OrderServices from "../../services/OrderServices";
import * as ProductServices from "../../services/ProductServices";
import * as UserServices from "../../services/UserServices";
import { useQuery } from "react-query";
import { convertPrice } from "../../utils";
import {
  UserOutlined,
  ProductOutlined,
  PieChartOutlined,
  // OrderedListOutlined,
  ShoppingCartOutlined,
  MoneyCollectFilled,
  WalletOutlined,
} from "@ant-design/icons";
// Component AdminDashboard
export const AdminDashboard = () => {
  const order = useSelector((state) => state.order);
  const product = useSelector((state) => state.product);
  const user = useSelector((state) => state.user);

  const getAllUsers = async () => {
    const res = await UserServices.getAllUsers(user?.access_token);
    return res;
  };

  const queryUsers = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  const { isLoading: isLoadingUsers, data: users } = queryUsers;

  const getAllProducts = async () => {
    const res = await ProductServices.getAllProducts();
    return res;
  };

  const queryProducts = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const { isLoading: isLoadingProduct, data: products } = queryProducts;

  const getAllOrders = async () => {
    const res = await OrderServices.getAllOrders(user?.access_token);
    return res;
  };

  const queryOrders = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });
  const { isLoading: isLoadingOrders, data: orders } = queryOrders;

  // Kiểm tra nếu dữ liệu đang được tải
  // if (isLoadingUsers || isLoadingProduct || isLoadingOrders) {
  //   return <div>Loading...</div>;
  // }

  // Nếu dữ liệu đã được tải, tiếp tục với các biểu đồ và nội dung
  const totalPrice = orders?.data.reduce((sum, order) => {
    // Kiểm tra nếu đơn hàng đã thanh toán (isPaid: true)
    if (order.isPaid) {
      return sum + order.totalPrice;
    }
    return sum;
  }, 0);

  // Dữ liệu doanh thu theo tháng
  const dataRevenue = orders?.data.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });
    const existingMonth = acc.find((item) => item.month === month);

    if (existingMonth) {
      existingMonth.revenue += order.totalPrice;
    } else {
      acc.push({ month, revenue: order.totalPrice });
    }

    return acc;
  }, []);

  // Dữ liệu doanh thu theo ngày
  const dataDailyRevenue = orders?.data.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existingDay = acc.find((item) => item.day === date);

    if (existingDay) {
      existingDay.revenue += order.totalPrice;
    } else {
      acc.push({ day: date, revenue: order.totalPrice });
    }

    return acc;
  }, []);

  // Biểu đồ số lượng đơn hàng theo ngày
  const dataOrders = orders?.data.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existingDay = acc.find((item) => item.day === date);

    if (existingDay) {
      existingDay.orders += 1; // Tăng số lượng đơn hàng cho ngày này
    } else {
      acc.push({ day: date, orders: 1 });
    }

    return acc;
  }, []);

  // Biểu đồ số lượng đơn hàng theo tháng
  const dataMonthlyOrders = orders?.data.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });
    const existingMonth = acc.find((item) => item.month === month);

    if (existingMonth) {
      existingMonth.orders += 1; // Tăng số lượng đơn hàng cho tháng này
    } else {
      acc.push({ month, orders: 1 });
    }

    return acc;
  }, []);

  // Dữ liệu cho biểu đồ tròn - số lượng sản phẩm còn hàng và hết hàng
  const dataStock = products?.data?.reduce(
    (acc, product) => {
      if (product.countInStock > 0) {
        acc.inStock += 1;
      } else {
        acc.outOfStock += 1;
        acc.outOfStockProducts.push(product._id); // Thêm ID sản phẩm hết hàng vào mảng
      }
      return acc;
    },
    { inStock: 0, outOfStock: 0, outOfStockProducts: [] }
  ) || { inStock: 0, outOfStock: 0, outOfStockProducts: [] }; // Giá trị mặc định

  // Màu sắc cho từng phần của biểu đồ tròn
  const COLORS = ["#0088FE", "#FF8042"];

  // Giả sử `products` là mảng các sản phẩm của bạn
  const productData = products?.data || []; // Lấy dữ liệu sản phẩm (cung cấp giá trị mặc định nếu không có)

  return (
    <div className="container mx-auto p-6">
      {/* Hiển thị Loading Spinner nếu đang tải dữ liệu */}
      {(isLoadingUsers || isLoadingProduct || isLoadingOrders) && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <span className="text-white text-2xl">Loading...</span>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Tổng quan đơn hàng */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white shadow-md rounded-md flex ỉtems-center gap-2">
          <h3 className="font-semibold text-2xl">
            {" "}
            <ShoppingCartOutlined /> Total Orders:{" "}
          </h3>
          <p className="text-2xl">
            <i>{orders?.data.length}</i>
          </p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md flex items-center gap-2">
          <h3 className="font-semibold text-2xl">
            <WalletOutlined /> Total Revenue:{" "}
          </h3>
          <p className="text-2xl">
            <i>{convertPrice(totalPrice)}</i>
          </p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md flex items-center gap-2">
          <h3 className="font-semibold text-2xl">
            <UserOutlined /> Total Users:{" "}
          </h3>
          <p className="text-2xl">
            <i>{users?.data.length}</i>
          </p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-md flex items-center gap-2">
          <h3 className="font-semibold text-2xl">
            <ProductOutlined /> Total Product:{" "}
          </h3>
          <p className="text-2xl">
            <i>{products?.data.length}</i>
          </p>
        </div>
      </div>

      {/* Biểu đồ Doanh thu */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => `${convertPrice(value)}`}
              width={150}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ Doanh thu hàng ngày */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataDailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
              tickFormatter={(value) => `${convertPrice(value)}`}
              width={150}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ Số lượng đơn hàng */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Daily Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => `${value}`} width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ Số lượng đơn hàng theo tháng */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Monthly Orders</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataMonthlyOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}`} width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Product Stock Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "In Stock", value: dataStock.inStock },
                { name: "Out of Stock", value: dataStock.outOfStock },
              ]}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
            >
              {[
                <Cell key="inStock" fill={COLORS[0]} />,
                <Cell key="outOfStock" fill={COLORS[1]} />,
              ]}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {dataStock.outOfStockProducts.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-lg">Out of Stock Products:</h4>
          <ul className="list-disc pl-5">
            {dataStock.outOfStockProducts.map((id) => (
              <li key={id} className="text-sm">
                ID: {id}
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </div>
  );
};
