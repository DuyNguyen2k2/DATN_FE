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
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [commune, setCommune] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
    setCity(user?.city);
    setDistrict(user?.district);
    setCommune(user?.commune);
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
  const handleChangeCity = (value) => {
    setCity(value);
  };
  const handleChangeDistrict = (value) => {
    setDistrict(value);
  };
  const handleChangeCommune = (value) => {
    setCommune(value);
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
    mutation.mutate({
      id: user?.id,
      name,
      phone,
      address,
      avatar,
      city,
      district,
      commune,
      access_token: user?.access_token,
    });
  };

  return (
    <div className="mb-[85px] p-2">
      <div className="container mx-auto xl:mt-[65px] mt-[20px]">
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

      <Loading isLoading={false}>
        <div className="container mx-auto">
          <h1 className="text-xl font-bold mb-4">Thông tin người dùng</h1>

          <Row gutter={16}>
            {/* Avatar và Upload */}
            <Col
              xs={24}
              md={8}
              className="text-center flex flex-col items-center justify-center mb-5"
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
                className="mt-4"
                maxCount={1}
                showUploadList={false}
                onChange={handleOnchangeAvatar}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Col>

            {/* Thông tin người dùng */}
            <Col xs={24} md={16}>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <InputForm
                    id="name"
                    placeholder="Họ tên"
                    value={name}
                    handleonchange={(value) => setName(value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <InputForm
                    id="phone"
                    placeholder="Số điện thoại"
                    value={phone}
                    handleonchange={(value) => setPhone(value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thành phố
                  </label>
                  <InputForm
                    id="city"
                    placeholder="Thành phố"
                    value={city}
                    handleonchange={(value) => setCity(value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quận/Huyện
                  </label>
                  <InputForm
                    id="district"
                    placeholder="Quận/Huyện"
                    value={district}
                    handleonchange={(value) => setDistrict(value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Xã/Thị xã
                  </label>
                  <InputForm
                    id="commune"
                    placeholder="Xã/Thị xã"
                    value={commune}
                    handleonchange={(value) => setCommune(value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <InputForm
                    id="address"
                    placeholder="Địa chỉ"
                    value={address}
                    handleonchange={(value) => setAddress(value)}
                  />
                </div>
              </div>
            </Col>
          </Row>

          {/* Buttons */}
          <div className="flex gap-4 justify-end mt-6">
            <ButtonComponent
              onClick={handleUpdate}
              textButton="Cập nhật"
              className="rounded"
              type="primary"
            />
            <ButtonComponent
              onClick={() => navigate("/")}
              textButton="Thoát"
              className="rounded"
              type="link"
            />
            <Button
              onClick={() => navigate("/change-password")}
              type="default"
              className="rounded "
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Loading>
    </div>
  );
};
