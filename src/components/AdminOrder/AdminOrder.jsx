/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import { Button, Form, Image, message, Select, Space, Upload } from "antd";
import { TableComponent } from "../TableComponent/TableComponent";
import { useEffect, useRef, useState } from "react";
import { InputComponent } from "../InputComponent/InputComponent";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { convertPrice, getBase64 } from "../../utils";
import * as OrderServices from "../../services/OrderServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../LoadingComponent/Loading";
import { useQuery } from "react-query";
import { DrawerComponent } from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { useForm } from "antd/es/form/Form";
import { SelectComponent } from "../SelectComponent/SelectComponent";
import { orderContant } from "../../../contant";

export const AdminOrder = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const { Option } = Select;

  const getAllOrders = async () => {
    const res = await OrderServices.getAllOrders(user?.access_token);
    return res;
  };

  const queryOrders = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });
  const { isLoading: isLoadingOrders, data: orders } = queryOrders;

  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);


  const renderAction = () => {
    return (
      <div className="min-[770px]:flex gap-1">
        <Button type="primary">
          <EditOutlined />
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => setIsShowModalDelete(true)}
        >
          <DeleteOutlined />
        </Button>
      </div>
    );
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });
  // console.log('order', orders)
  const handleConfirmDelivery = async (orderId) => {
    setIsLoadingUpdate(true);
    try {
      // Giả sử có một API để cập nhật trạng thái đơn hàng
      const res = await OrderServices.updateOrderStatus(orderId, user?.access_token, { isPaid: true, isDelivered: true });
      console.log('res', res)
      if (res.status === "OK") {
        messageApi.success("Đơn hàng đã được xác nhận giao hàng.");
        // Cập nhật lại dữ liệu sau khi xác nhận giao hàng thành công
        queryOrders.refetch(); // Nếu dùng react-query
      } else {
        messageApi.error("Không thể xác nhận giao hàng.");
      }
    } catch (error) {
      messageApi.error("Đã xảy ra lỗi khi xác nhận giao hàng.");
    } finally {
      setIsLoadingUpdate(false);
    }
  };
  const columns = [
    {
      title: "#",
      // dataIndex: "_id",
      key: "index",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
      width: 250,
      ...getColumnSearchProps("_id"),
      // sorter: (a, b) => a._id - b._id,
    },
    {
      title: "Order Items",
      dataIndex: "orderItems",
      key: "orderItems",
      width: 400,
      render: (orderItems) => (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {orderItems.map((item, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "50px", height: "50px", marginRight: "10px", objectFit: "cover", borderRadius: "4px" }}
              />
              <div>
                <div><strong>{item.name}</strong></div>
                <div><i>Số lượng:</i> {item.amount}</div>
                <div><i>Giá:</i> {convertPrice(item.price)}</div>
              </div>
            </li>
          ))}
        </ul>
      ),
      ...getColumnSearchProps("orderItems"),
    },
    
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    // {
    //   title: "Avatar",
    //   dataIndex: "avatar",
    //   key: "avatar",
    //   width: 150,
    //   render: (text, record) => (
    //     <Image width={50} height={50} src={record.avatar} alt={record.name} />
    //   ),
    // },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: 200,
      render: (text) => `0${text}`,
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Location",
      key: "location",
      width: 300,
      render: (text, record) => `${record.address}, ${record.commune}, ${record.district}, ${record.city}`,
      ...getColumnSearchProps("location"),
    },
    {
      title: "Price",
      dataIndex: "itemsPrice",
      key: "itemsPrice",
      width: 200,
      render: (text) => `${convertPrice(text)} `,
      sorter: (a, b) => a.itemsPrice - b.itemsPrice,
      ...getColumnSearchProps("itemsPrice"),
    },
    {
      title: "Shipping Price",
      dataIndex: "shippingPrice",
      key: "shippingPrice",
      width: 200,
      render: (text) => `${convertPrice(text)} `,
      sorter: (a, b) => a.shippingPrice - b.shippingPrice,
      ...getColumnSearchProps("shippingPrice"),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 200,
      render: (text) => `${convertPrice(text)} `,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 150,
      // fixed: "right",
      // render: (text) => `${text ? "Đã thanh toán" : "Chưa thanh toán"} `,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Shipped",
      dataIndex: "isDelivered",
      key: "isDelivered",
      width: 150,
      // fixed: "right",
      render: (text) => `${text ? "Đã giao hàng" : "Chưa giao hàng"} `,
      ...getColumnSearchProps("isDelivered"),
    },
    {
      title: "Paided",
      dataIndex: "isPaid",
      key: "isPaid",
      width: 150,
      render: (text) => `${text ? "Đã thanh toán" : "Chưa thanh toán"} `,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (text) => {
        const date = new Date(text);
        return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      },
      ...getColumnSearchProps("createdAt"),
    },
    {
      title: "Confirm Delivery",
      key: "confirmDelivery",
      width: 200,
      fixed: "right",
      render: (text, record) => {
        // Chỉ hiển thị nút khi đơn hàng chưa giao (isDelivered === false)
        return !record.isDelivered ? (
          <Button
            type="primary"
            onClick={() => handleConfirmDelivery(record._id)}
            disabled={isLoadingUpdate} // Disable khi đang cập nhật
          >
            Xác nhận giao hàng
          </Button>
        ) : (
          "Đã giao hàng"
        );
      },
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   fixed: "right",
    //   width: 120,
    //   render: renderAction,
    // },
  ];

  const dataSource = orders?.data.map((order, index) => ({
    ...order,
    key: order._id,
    userName: order?.shippingAddress?.fullName,
    phone: order?.shippingAddress?.phone,
    address: order?.shippingAddress?.address,
    commune: order?.shippingAddress?.commune,
    district: order?.shippingAddress?.district,
    city: order?.shippingAddress?.city,
    paymentMethod: orderContant.payment[order?.paymentMethod],
    index: index + 1,
  }));
  console.log("orders", orders)
  return (
    <div>
      {contextHolder}
      <div className="font-bold text-lg mb-2">
        <h1>Quản lý đơn hàng</h1>
      </div>
      <div className="">
        <TableComponent
          columns={columns}
          dataTable={dataSource}
          isLoading={isLoadingOrders}
          sheet="Orders"
          
          scroll={{
            x: 1300,
            y: 500,
          }}
        />
        
      </div>
    </div>
  );
};
