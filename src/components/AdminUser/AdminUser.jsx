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
import { getBase64 } from "../../utils";
import * as UserServices from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../LoadingComponent/Loading";
import { useQuery } from "react-query";
import { DrawerComponent } from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { useForm } from "antd/es/form/Form";
import { SelectComponent } from "../SelectComponent/SelectComponent";

export const AdminUser = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [form] = useForm();
  const { Option } = Select;

  // const [stateUser, setstateUser] = useState({
  //   name: "",
  //   phone: "",
  //   email: "",
  //   address: "",
  //   avatar: "",
  //   isAdmin: false,
  // });

  const [stateUserDetails, setstateUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    avatar: "",
    isAdmin: false,
  });

  // const mutationUpdate = useMutationHooks((data) => {
  //   console.log('data', data)
  //   const { id, token, ...rests } = data;
  //   const res = UserServices.updateUser({
  //     id,
  //     token,
  //     rests,
  //   });
  //   return res;
  // });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserServices.updateUser(id, token, rests);
    return res;
  });

  const { isLoading: isLoadingUpdated, data: dataUpdated } = mutationUpdate;

  const getAllUsers = async () => {
    const res = await UserServices.getAllUsers(user?.access_token);
    return res;
  };

  const queryUsers = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  const { isLoading: isLoadingUsers, data: users } = queryUsers;

  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const fetchGetData = async (rowSelected, token) => {
    const res = await UserServices.getOneUser(rowSelected, token);
    if (res?.data) {
      setstateUserDetails({
        name: res?.data.name,
        phone: res?.data.phone,
        email: res?.data.email,
        address: res?.data.address,
        avatar: res?.data.avatar,
        isAdmin: res?.data.isAdmin,
      });
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetData(rowSelected, user?.access_token);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleOnChangeDetails = (e) => {
    setstateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setstateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };

  const handleEditUser = () => {
    setIsOpenDrawer(true);
  };

  const onEditUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queryUsers.refetch();
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
        <Button type="primary" onClick={handleEditUser}>
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

  const mutationDelete = useMutationHooks(async (data) => {
    const { id, token } = data;
    const userDetails = await UserServices.getOneUser(id, token);
    const userName = userDetails.data.name;

    // Check if the ID matches the one you want to protect
    if (id === "669b2a2c4d1b9a66c1eb74f2") {
      messageApi.open({
        type: "error",
        content: `Không thể xóa người dùng ${userName} với ID ${id}`,
      });
      return; // Abort the mutation
    }

    const res = UserServices.deleteUser(id, token);
    return res;
  });
  const mutationDeleteMany = useMutationHooks(async (data) => {
    const { token, ...ids } = data;
    const res = UserServices.deleteManyUsers(ids, token);
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
          queryUsers.refetch();
        },
      }
    );
  };

  const handleOkDeleteManyUsers = (ids) => {
    mutationDeleteMany.mutate(
      {
        ids: ids,
        token: user?.access_token,
      },
      {
        onSettled: () => {
          queryUsers.refetch();
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
      setIsShowModalDelete(false);
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
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 150,
      render: (text, record) => (
        <Image width={50} height={50} src={record.avatar} alt={record.name} />
      ),
    },
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 300,
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 300,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      width: 150,
      filters: [
        {
          text: "Yes",
          value: "Yes",
        },
        {
          text: "No",
          value: "No",
        },
      ],
      // onFilter: (value, record) => {
      //   return record.isAdmin === value;
      // }
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: renderAction,
    },
  ];

  const dataSource = users?.data.map((user, index) => ({
    ...user,
    key: user._id,
    isAdmin: user.isAdmin ? "Yes" : "No",
    index: index + 1,
  }));

  return (
    <div>
      {contextHolder}
      <div className="font-bold text-lg mb-2">
        <h1>Quản lý người dùng</h1>
      </div>
      <div className="">
        <TableComponent
          columns={columns}
          dataTable={dataSource}
          isLoading={isLoadingUsers}
          titleDeleteMany="Xóa nhiều người dùng"
          contentDeleteMany="Bạn có chắc xóa những người dùng này không?"
          sheet="Users"
          handleOkDeleteMany={handleOkDeleteManyUsers}
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
          title="Chi tiết người dùng"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          width="500px"
        >
          <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
            <Form
              name="editUser"
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
              onFinish={onEditUser}
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input name User!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="name"
                  value={stateUserDetails["name"]}
                  onChange={handleOnChangeDetails}
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input phone number!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="phone"
                  value={stateUserDetails["phone"]}
                  onChange={handleOnChangeDetails}
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input email!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="email"
                  value={stateUserDetails["email"]}
                  onChange={handleOnChangeDetails}
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input address!",
                  },
                ]}
              >
                <InputComponent
                  className=""
                  name="address"
                  value={stateUserDetails["address"]}
                  onChange={handleOnChangeDetails}
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Admin"
                name="isAdmin"
                rules={[
                  {
                    required: true,
                    message: "Please input is admin!",
                  },
                ]}
              >
                {/* <Select
                  value="false"
                  onChange={handleSelectChange}
                  disabled={false}
                >
                  <Option value="true">Yes</Option>
                  <Option value="false">No</Option>
                </Select> */}
                <InputComponent
                  className=""
                  name="isAdmin"
                  value={stateUserDetails["isAdmin"]}
                  onChange={handleOnChangeDetails}
                />
                {/* <SelectComponent defaultValue={stateUserDetails["isAdmin"]}/> */}
              </Form.Item>

              <Form.Item label="Avatar" name="avatar">
                <div className="flex gap-2">
                  <div className="">
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      showUploadList={false}
                      onChange={handleOnchangeAvatarDetail}
                      disabled
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
                    {stateUserDetails["avatar"] && (
                      <Image
                        width={100}
                        height={100}
                        className="rounded-md"
                        src={stateUserDetails["avatar"]}
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
          title="Xóa người dùng"
          open={isShowModalDelete}
          onCancel={handleCancleDelete}
          onOk={handleOkDelete}
        >
          <Loading isLoading={isLoadingDeleted}>
            <div className="">
              <h1>
                Bạn có chắc chắn xóa{" "}
                <span className="font-bold">{stateUserDetails.name}</span>{" "}
                không?
              </h1>
            </div>
          </Loading>
        </ModalComponent>
      </div>
    </div>
  );
};
