/* eslint-disable react-hooks/exhaustive-deps */
import { Image, message } from "antd";
import { ButtonComponent } from "../../components/ButtonComponent/ButtonComponent";
import { InputForm } from "../../components/InputForm/InputForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../../components/LoadingComponent/Loading";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/sign-in");
  };
  const mutation = useMutationHooks((data) => UserService.signUp(data));
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const { isLoading, data } = mutation;
  useEffect(() => {
    if (data?.status === "OK") {
      messageApi.open({
        type: "success",
        content: data?.message,
      });
      setTimeout(() => {
        handleLogin();
      }, 1000);
    } else if (data?.status === "ERR") {
      messageApi.open({
        type: "error",
        content: data?.message,
      });
    }
  }, [data]);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangePassword = (value) => {
    setPassword(value);
  };
  const handleOnchangeName = (value) => {
    setName(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };
  const handleSignUp = () => {
    mutation.mutate({ name, phone, email, password, confirmPassword });
  };
  return (
    <div
      className="flex justify-center items-center h-[100vh] px-5"
      style={{ background: "rgba(0,0,0,0.53)" }}
    >
      {contextHolder}
      <div className="min-[770px]:w-[800px] min-[770px]:h-[445px] rounded-lg bg-white flex">
        <div className="min-[770px]:w-[500px] pt-10 pb-6 px-[45px] flex flex-1 flex-col">
          <div className="">
            <h1 className="text-2xl font-bold">Xin chào</h1>
            <p className="text-sm mt-1 mb-5">Đăng nhập hoặc tạo tài khoản</p>
            <InputForm
              className="mb-2"
              placeholder="Tên"
              value={name}
              handleonchange={handleOnchangeName}
            />
            <InputForm
              className="mb-2"
              placeholder="Số điện thoại"
              value={phone}
              handleonchange={handleOnchangePhone}
            />
            <InputForm
              className="mb-2"
              placeholder="Email"
              value={email}
              handleonchange={handleOnchangeEmail}
            />
            <div className="relative">
              <span
                className="z-10 absolute top-1 right-2"
                onClick={() => {
                  setIsShowPassword(!isShowPassword);
                }}
              >
                {isShowPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>
            <InputForm
              className="mb-2"
              placeholder="Password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              handleonchange={handleOnchangePassword}
            />
            <div className="relative">
              <span
                className="z-10 absolute top-1 right-2"
                onClick={() => {
                  setIsShowConfirmPassword(!isShowConfirmPassword);
                }}
              >
                {isShowConfirmPassword ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )}
              </span>
            </div>
            <InputForm
              className="mb-2"
              placeholder="Confirm Password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              handleonchange={handleOnchangeConfirmPassword}
            />
            {data?.status === "ERR" && (
              <span className="text-red-500">{data?.message}</span>
            )}
            <Loading isLoading={isLoading}>
              <ButtonComponent
                disabled={
                  !name.length ||
                  !phone.length ||
                  !email.length ||
                  !password.length ||
                  !confirmPassword.length
                }
                onClick={handleSignUp}
                className="rounded w-full mt-[20px] mb-[10px]"
                danger
                type="primary"
                textButton="Đăng Ký"
                size="large"
              />
            </Loading>
            <p className="text-sm">
              Đã có tài khoản?{" "}
              <span
                onClick={handleLogin}
                className="text-[#0D5CB6] cursor-pointer hover:underline"
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
        <div
          style={{
            background:
              "linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%",
          }}
          className="w-[300px] h-full min-[770px]:flex justify-center flex-col items-center gap-1 text-blue-600 rounded-r-lg hidden"
        >
          <Image
            width="203px"
            height="203px"
            className="rounded-full object-cover"
            src="https://th.bing.com/th/id/OIP.f955eR5C2FAkk9FL5bbarAHaEK?w=296&h=180&c=7&r=0&o=5&pid=1.7"
            preview={false}
          />
          <h4 className="font-semibold">Mua sắm tại Techtrovedecor</h4>
          <p className="text-sm">Siêu ưu đãi mỗi ngày</p>
        </div>
      </div>
    </div>
  );
};
