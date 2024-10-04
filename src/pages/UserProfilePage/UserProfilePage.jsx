/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Breadcrumb, Button, Col, Image, message, Row, Upload } from "antd";
import { HomeOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { InputForm } from "../../components/InputForm/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { ButtonComponent } from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slices/userSlice";
import { Loading } from "../../components/LoadingComponent/Loading";
import { getBase64 } from "../../utils";

export const UserProfilePage = () => {
  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    const res = UserService.updateUser(id, access_token, rests);
    return res;
  });
  const { isLoading, data } = mutation;
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (data?.status === "OK") {
      handleGetOneUser(user?.id, user?.access_token);
      messageApi.open({
        type: "success",
        content: data?.message,
      });
    } else if (data?.status === "ERR") {
      messageApi.open({
        type: "error",
        content: data?.message,
      });
    }
  }, [data]);

  const handleChangeName = (value) => {
    setName(value);
  };
  const handleChangePhone = (value) => {
    setPhone(value);
  };
  const handleChangeAddress = (value) => {
    setAddress(value);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleGetOneUser = async (id, token) => {
    const res = await UserService.getOneUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleUpdate = () => {
    mutation.mutate(
      {
        id: user?.id,
        name,
        phone,
        address,
        avatar,
        access_token: user?.access_token,
      }
    );
  };

  return (
    <div>
      {contextHolder}
      <div className="container mx-auto xl:mt-[65px] mt-[150px]">
        <Breadcrumb
          className="font-semibold"
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: "Thông tin người dùng",
            },
          ]}
        />
      </div>
      <Loading isLoading={isLoading}>
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Thông tin người dùng</h1>
          <div className="">
            <Row className="border rounded-lg mt-5 hidden min-[770px]:flex">
              <Col
                span={10}
                className="flex justify-center items-center flex-col p-5 border-r"
              >
                <Image
                  className="rounded-full"
                  width={200}
                  height={200}
                  src={avatar}
                  fallback="https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg"
                  preview={false}
                />

                <Upload
                  className="mt-5"
                  maxCount={1}
                  showUploadList={false}
                  onChange={handleOnchangeAvatar}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Col>
              <Col span={14} className="p-5">
                <div className="mb-2">
                  <label htmlFor="name">Tên</label>
                  <InputForm
                    id="name"
                    placeholder="Họ tên"
                    value={name}
                    handleonchange={handleChangeName}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="name">SĐT</label>
                  <InputForm
                    id="name"
                    placeholder="Số điện thoại"
                    value={phone}
                    handleonchange={handleChangePhone}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="name">Địa chỉ</label>
                  <InputForm
                    id="name"
                    placeholder="Địa chỉ"
                    value={address}
                    handleonchange={handleChangeAddress}
                  />
                </div>
              </Col>
            </Row>
            <Row className="border rounded-lg mt-5 flex min-[770px]:hidden">
              <Col
                span={24}
                className="flex justify-center items-center flex-col p-5 border-b"
              >
                <Image
                  className="rounded-full object-cover"
                  width={200}
                  height={200}
                  src={avatar}
                  fallback="https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg"
                  preview={false}
                />

                <Upload
                  className="mt-5"
                  maxCount={1}
                  showUploadList={false}
                  onChange={handleOnchangeAvatar}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Col>
              <Col span={24} className="p-5">
                <div className="mb-2">
                  <label htmlFor="name">Tên</label>
                  <InputForm
                    id="name"
                    placeholder="Họ tên"
                    value={name}
                    handleonchange={handleChangeName}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="name">SĐT</label>
                  <InputForm
                    id="name"
                    placeholder="Số điện thoại"
                    value={phone}
                    handleonchange={handleChangePhone}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="name">Địa chỉ</label>
                  <InputForm
                    id="name"
                    placeholder="Địa chỉ"
                    value={address}
                    handleonchange={handleChangeAddress}
                  />
                </div>
              </Col>
            </Row>
            <div className="flex gap-2 justify-end items-center mt-5 mb-5">
              <ButtonComponent
                onClick={handleUpdate}
                textButton="Cập nhật"
                className="rounded"
                type="primary"
              />
              <ButtonComponent
                onClick={() => {
                  navigate("/");
                }}
                textButton="Thoát"
                className="rounded"
                type="link"
              />
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};
