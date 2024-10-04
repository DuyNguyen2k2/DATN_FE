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
  StarOutlined,
} from "@ant-design/icons";
import { getBase64, renderOptions } from "../../utils";
import * as ProductServices from "../../services/ProductServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../LoadingComponent/Loading";
import { useQuery } from "react-query";
import { DrawerComponent } from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { useForm } from "antd/es/form/Form";

export const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [form] = useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };
  
  
  const handleOk = () => {
    onFinish();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    countInStock: "",
    type: "",
    discount: "",
    image: "",
    rating: "",
    newType: "",
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    countInStock: "",
    type: "",
    discount: "",
    image: "",
    rating: "",
  });

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      countInStock,
      type,
      discount,
      image,
      rating,
    } = data;
    const res = ProductServices.createProduct({
      name,
      price,
      description,
      countInStock,
      type,
      discount,
      image,
      rating,
    });
    return res;
  });

  // const mutationUpdate = useMutationHooks((data) => {
  //   console.log('data', data)
  //   const { id, token, ...rests } = data;
  //   const res = ProductServices.updateProduct({
  //     id,
  //     token,
  //     rests,
  //   });
  //   return res;
  // });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductServices.updateProduct(id, token, rests);
    return res;
  });

  const { isLoading, data } = mutation;
  const { isLoading: isLoadingUpdated, data: dataUpdated } = mutationUpdate;

  useEffect(() => {
    if (data?.status === "OK") {
      messageApi.open({
        type: "success",
        content: data?.message,
      });
      setTimeout(() => {
        handleCancel();
      }, 500);
    } else if (data?.status === "ERR") {
      messageApi.open({
        type: "error",
        content: data?.message,
      });
    }
  }, [data, messageApi]);

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      countInStock: stateProduct.countInStock,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      discount: stateProduct.discount,
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProducts.refetch();
      },
    });
  };

  const parsePrice = (price) => {
    return parseFloat(price.replace(/[.,\s]/g, ""));
  };

  const formatPrice = (price) => {
    return price
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("VND", "đ");
  };



  const handleOnChange = (e) => {
    // setStateProduct({
    //   ...stateProduct,
    //   [e.target.name]: e.target.value,
    // });
    const { name, value } = e.target;

    if (name === "price") {
      setStateProduct({
        ...stateProduct,
        price: parsePrice(value),
      });
    } else {
      setStateProduct({
        ...stateProduct,
        [name]: value,
      });
    }
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const getAllProducts = async () => {
    const res = await ProductServices.getAllProducts();
    return res;
  };

  const queryProducts = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const { isLoading: isLoadingProduct, data: products } = queryProducts;

  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const fetchGetData = async (rowSelected) => {
    const res = await ProductServices.getOneProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data.name,
        price: res?.data.price,
        description: res?.data.description,
        countInStock: res?.data.countInStock,
        type: res?.data.type,
        discount: res?.data.discount,
        image: res?.data.image,
        rating: res?.data.rating,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateProductDetails);
  }, [form, stateProductDetails]);

  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true);
      fetchGetData(rowSelected);
    }
  }, [rowSelected]);

  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  const handleEditProduct = () => {
    setIsOpenDrawer(true);
  };

  const onEditProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProducts.refetch();
        },
      }
    );
  };
  useEffect(() => {
    if (dataUpdated?.status === "OK") {
      messageApi.open({
        type: "success",
        content: dataUpdated?.message,
      });
      setTimeout(() => {
        handleCancelDrawer();
      }, 500);
    } else if (dataUpdated?.status === "ERR") {
      messageApi.open({
        type: "error",
        content: dataUpdated?.message,
      });
    }
  }, [dataUpdated, messageApi]);

  const handleCancelDrawer = () => {
    setIsOpenDrawer(false);
    form.resetFields();
  };
  const renderAction = () => {
    return (
      <div className="min-[770px]:flex gap-1">
        <Button type="primary" onClick={handleEditProduct}>
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

  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductServices.deleteProduct(id, token);
    return res;
  });

  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductServices.deleteManyProducts(ids, token);
    return res;
  });

  const { isLoading: isLoadingDeleted, data: dataDeleted } = mutationDelete;
  const { isLoading: isLoadingDeletedMany, data: dataDeletedMany } =
    mutationDeleteMany;
  const handleCancleDelete = () => {
    setIsShowModalDelete(false);
  };

  const handleOkDelete = () => {
    mutationDelete.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
      },
      {
        onSettled: () => {
          queryProducts.refetch();
        },
      }
    );
  };
  const handleOkDeleteManyProducts = (ids) => {
    // console.log('id', {ids})
    mutationDeleteMany.mutate(
      {
        ids: ids,
        token: user?.access_token,
      },
      {
        onSettled: () => {
          queryProducts.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (dataDeleted?.status === "OK") {
      messageApi.open({
        type: "success",
        content: dataDeleted?.message,
      });
      setIsShowModalDelete(false);
    } else if (dataDeleted?.status === "ERR") {
      messageApi.open({
        type: "error",
        content: dataDeleted?.message,
      });
    }
  }, [dataDeleted]);

  useEffect(() => {
    if (dataDeletedMany?.status === "OK") {
      messageApi.open({
        type: "success",
        content: dataDeletedMany?.message,
      });
    } else if (dataDeletedMany?.status === "ERR") {
      messageApi.open({
        type: "error",
        content: dataDeletedMany?.message,
      });
    }
  }, [dataDeletedMany]);

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

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (text, record) => (
        <Image width={50} height={50} src={record.image} alt={record.name} />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      sorter: (a, b) => a.price - b.price,
      render: (text) => formatPrice(text),
      filters: [
        { text: "Dưới 50.000đ", value: "under50k" },
        { text: "50.000đ - 150.000đ", value: "50k-150k" },
        { text: "150.000đ - 500.000đ", value: "150k-500k" },
        { text: "Trên 500.000đ", value: "above500k" },
      ],
      onFilter: (value, record) => {
        const price = Number(record.price);
        if (value === "under50k") {
          return price < 50000;
        } else if (value === "50k-150k") {
          return price >= 50000 && price <= 150000;
        } else if (value === "150k-500k") {
          return price > 150000 && price <= 500000;
        } else if (value === "above500k") {
          return price > 500000;
        }
        return false;
      },
    },
    {
      title: "Count In Stock",
      dataIndex: "countInStock",
      key: "countInStock",
      width: 200,
      sorter: (a, b) => a.countInStock - b.countInStock,
      ...getColumnSearchProps("countInStock"),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 150,
      render: (rating) => (
        <div>
          {rating} <StarOutlined style={{ color: "gold", marginLeft: 4 }} />
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        { text: "Dưới 3 sao", value: "under3star" },
        { text: "3 sao - 4 sao", value: "3star-4star" },
        { text: "4 sao - 5 sao", value: "4star-5star" },
        { text: "5 sao", value: "5star" },
      ],
      onFilter: (value, record) => {
        const rate = Number(record.rating);
        if (value === "under3star") {
          return rate < 3;
        } else if (value === "3star-4star") {
          return rate >= 3 && rate <= 4;
        } else if (value === "4star-5star") {
          return rate > 4 && rate <= 5;
        } else if (value === "5star") {
          return rate == 5;
        }
        return false;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      ...getColumnSearchProps("description"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: 150,
      render: (text) => `${text ? text : 0}%`, // Thêm ký tự `%` vào sau số
      sorter: (a, b) => a.discount - b.discount,
      ...getColumnSearchProps("discount"),
    },
    {
      title: "Selled",
      dataIndex: "selled",
      key: "selled",
      width: 150,
      sorter: (a, b) => a.selled - b.selled,
      ...getColumnSearchProps("selled"),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: renderAction,
    },
  ];

  const dataSource = products?.data.map((product, index) => ({
    ...product,
    key: product._id,
    index: index + 1,
  }));

  const fetchAllType = async () => {
    const res = await ProductServices.getAllType();
    return res;
  };

  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllType,
  });

  const [typeSelect, setTypeSelect] = useState([]);
  const handleChangeSelected = (value) => {
    console.log("value", value);

    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  console.log("value", stateProduct);

  return (
    <div>
      {contextHolder}
      <div className="font-bold text-lg mb-2">
        <h1>Quản lý sản phẩm</h1>
      </div>
      <div className="">
        <Button
          className="mb-5 rounded w-[100px] h-[100px]"
          onClick={showModal}
        >
          <i className="fa-solid fa-plus"></i>
        </Button>
        <ModalComponent
          forceRender
          title="Thêm mới sản phẩm"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Thêm"
          cancelText="Hủy"
          footer={null}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="addProduct"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              autoComplete="off"
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input name product!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="name"
                  value={stateProduct.name}
                  onChange={handleOnChange}
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input type product!",
                  },
                ]}
              >
                
                  <Select
                  name="type"
                  // defaultValue="lucy"
                  // style={{
                  //   width: 120,
                  // }}
                  value={stateProduct.type}
                  onChange={handleChangeSelected}
                  options={renderOptions(typeProduct?.data?.data)}
                />
                
                
              </Form.Item>

              {stateProduct.type === 'add_type' && (
                <Form.Item
                  label="New Type"
                  name="newType"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input type product!",
                  //   },
                  // ]}
                >
                  <InputComponent
                    className=""
                    value={stateProduct.newType}
                    onChange={handleOnChange}
                    name="newType"
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Count In Stock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input count in stock!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Count In Stock must be a number!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="countInStock"
                  value={stateProduct.countInStock}
                  onChange={handleOnChange}
                />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input price!",
                  },
                  {
                    pattern: /^(\d{1,3}(?:[.,]\d{3})*|\d+)(?:[.,]\d+)?$/,
                    message: "Price must be a number!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="price"
                  value={stateProduct.price}
                  onChange={handleOnChange}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input description!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="description"
                  value={stateProduct.description}
                  onChange={handleOnChange}
                />
              </Form.Item>

              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input discount!",
                  },
                  {
                    pattern: /^(\d+(\.\d*)?|\.\d+)$/,
                    message: "Discount must be a number!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="discount"
                  value={stateProduct.discount}
                  onChange={handleOnChange}
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input rating!",
                  },
                  {
                    pattern: /^(\d+(\.\d*)?|\.\d+)$/,
                    message: "Rating must be a number!",
                  },
                  {
                    validator: (_, value) =>
                      value >= 0 && value <= 5
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Rating must be between 0 and 5")
                          ),
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="rating"
                  value={stateProduct.rating}
                  onChange={handleOnChange}
                />
              </Form.Item>

              <Form.Item label="Image" name="image">
                <div className="flex gap-2">
                  <div className="">
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      showUploadList={false}
                      onChange={handleOnchangeAvatar}
                    >
                      <button
                        style={{
                          border: 0,
                          background: "none",
                        }}
                        type="button"
                      >
                        <PlusOutlined />
                        <div
                          style={{
                            marginTop: 8,
                          }}
                        >
                          Upload
                        </div>
                      </button>
                    </Upload>
                  </div>
                  <div className="">
                    {stateProduct.image && (
                      <Image
                        width={100}
                        height={100}
                        className="rounded-md"
                        src={stateProduct.image}
                        preview={false}
                      />
                    )}
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 18,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit" className="rounded">
                  Thêm
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
        <TableComponent
          columns={columns}
          dataTable={dataSource}
          isLoading={isLoadingProduct}
          handleOkDeleteMany={handleOkDeleteManyProducts}
          titleDeleteMany="Xóa nhiều sản phẩm"
          contentDeleteMany="Bạn có chắc xóa những sản phẩm này không?"
          sheet="Products"
          isLoadingDeleteMany={isLoadingDeleted}
          scroll={{
            x: 1300,
            y: 500,
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
        <DrawerComponent
          title="Chi tiết sản phẩm"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          width="500px"
        >
          <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
            <Form
              name="editProduct"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              autoComplete="off"
              onFinish={onEditProduct}
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input name product!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="name"
                  value={stateProductDetails["name"]}
                  onChange={handleOnChangeDetails}
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input type product!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="type"
                  value={stateProductDetails["type"]}
                  onChange={handleOnChangeDetails}
                />
              </Form.Item>

              <Form.Item
                label="Count In Stock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input count in stock!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Count In Stock must be a number!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="countInStock"
                  value={stateProductDetails["countInStock"]}
                  onChange={handleOnChangeDetails}
                />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input price!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Price must be a number!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="price"
                  value={stateProductDetails["price"]}
                  onChange={handleOnChangeDetails}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input description!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="description"
                  value={stateProductDetails["description"]}
                  onChange={handleOnChangeDetails}
                />
              </Form.Item>

              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input discount!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Discount must be a number!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="discount"
                  value={stateProductDetails["discount"]}
                  onChange={handleOnChangeDetails}
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input rating!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Rating must be a number!",
                  },
                  {
                    validator: (_, value) =>
                      value >= 0 && value <= 5
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Rating must be between 0 and 5")
                          ),
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="rating"
                  value={stateProductDetails["rating"]}
                  onChange={handleOnChangeDetails}
                />
              </Form.Item>

              <Form.Item label="Image" name="image">
                <div className="flex gap-2">
                  <div className="">
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      showUploadList={false}
                      onChange={handleOnchangeAvatarDetail}
                    >
                      <button
                        style={{
                          border: 0,
                          background: "none",
                        }}
                        type="button"
                      >
                        <PlusOutlined />
                        <div
                          style={{
                            marginTop: 8,
                          }}
                        >
                          Upload
                        </div>
                      </button>
                    </Upload>
                  </div>
                  <div className="">
                    {stateProductDetails["image"] && (
                      <Image
                        width={100}
                        height={100}
                        className="rounded-md"
                        src={stateProductDetails["image"]}
                        preview={false}
                      />
                    )}
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 18,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit" className="rounded">
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
        <ModalComponent
          title="Xóa sản phẩm"
          open={isShowModalDelete}
          onCancel={handleCancleDelete}
          onOk={handleOkDelete}
        >
          <Loading isLoading={isLoading}>
            <div className="">
              <h1>
                Bạn có chắc chắn xóa{" "}
                <span className="font-bold">{stateProductDetails.name}</span>{" "}
                không?
              </h1>
            </div>
          </Loading>
        </ModalComponent>
      </div>
    </div>
  );
};
