/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { Badge, Col, Image, Popover, Row } from "antd";
import { ButtonInputSearch } from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserServices";
import { clearUser } from "../../redux/slices/userSlice";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useEffect, useState } from "react";
import { searchProduct } from "../../redux/slices/productSlice";

export const HeaderComponent = ({
  isHiddenSearch = false,
  isHiddenCart = false,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/sign-in");
  };

  const handleUserProfile = () => {
    navigate("/user-profile");
  };

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const order = useSelector((state) => state.order);

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logout();
    dispatch(clearUser());
    navigate("/");
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setLoading(false);
  }, [user?.name]);

  const content = (
    <div>
      <p
        className="p-2 cursor-pointer hover:underline"
        onClick={handleUserProfile}
      >
        Thông tin người dùng
      </p>
      {user?.isAdmin ? (
        <p
          className="p-2 cursor-pointer hover:underline"
          onClick={() => {
            navigate("/system/admin");
          }}
        >
          Quản lý hệ thống
        </p>
      ) : (
        <p></p>
      )}

      <p className="p-2 cursor-pointer hover:underline" onClick={handleLogout}>
        Đăng xuất
      </p>
    </div>
  );

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  return (
    <div>
      <div className="">
        <div className="bg-[#1a94ff]">
          <Row className="container mx-auto p-3 hidden min-[900px]:flex justify-between">
            <Col
              span={6}
              className="xl:text-2xl text-xl font-bold text-white flex justify-end items-center"
            >
              <h1
                className="cursor-pointer hover:text-cyan-400"
                onClick={() => {
                  navigate("/");
                }}
              >
                TECHTROVEDECOR
              </h1>
            </Col>
            {!isHiddenSearch && (
              <Col span={12} className="px-2">
                <ButtonInputSearch
                  size="large"
                  textButton="Tìm kiếm"
                  placeholder="Tìm sản phẩm, danh mục hay thương hiệu mong muốn..."
                  allowClear
                  onChange={onSearch}
                />
              </Col>
            )}

            <Col span={6} className="text-white flex">
              <div className="flex justify-start items-center">
                {user?.access_token ? (
                  <Image
                    className="rounded-full"
                    width={40}
                    height={40}
                    src={user?.avatar}
                    fallback="https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg"
                    preview={false}
                  />
                ) : (
                  <i className="fa-solid fa-user fa-2xl"></i>
                )}
              </div>
              <Loading isLoading={loading}>
                {user?.access_token ? (
                  <div className="flex flex-col px-2 xl:text-sm text-xs">
                    <span>Hi,</span>
                    <Popover content={content} trigger="click">
                      <span className="w-28 truncate cursor-pointer hover:underline">
                        {userName}
                      </span>
                    </Popover>
                  </div>
                ) : (
                  <div className="flex flex-col px-2">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={handleLogin}
                    >
                      Đăng nhập / Đăng ký
                    </span>
                    <span>
                      Tài khoản <i className="fa-solid fa-caret-down fa-lg"></i>
                    </span>
                  </div>
                )}
              </Loading>
              {!isHiddenCart && (
                <div onClick={() => navigate('/order')} className="cursor-pointer xl:px-5 flex ">
                  <Badge
                    count={order?.orderItem.length}
                    size="small"
                    className="flex justify-start items-center"
                  >
                    <i className="fa-solid fa-cart-shopping fa-2xl text-white"></i>
                  </Badge>
                  <span className="flex justify-start items-end max-xl:text-xs h-[35px]">
                    Giỏ hàng
                  </span>
                </div>
              )}
            </Col>
          </Row>
          <Row className="container mx-auto p-3 min-[900px]:hidden flex">
            <Col
              span={24}
              className="text-xl font-bold text-white flex justify-center items-center mb-2"
            >
              <h1
                className="cursor-pointer hover:text-cyan-400"
                onClick={() => {
                  navigate("/");
                }}
              >
                TECHTROVEDECOR
              </h1>
            </Col>
            {!isHiddenSearch && (
              <Col span={24} className="px-2">
                <ButtonInputSearch
                  size="large"
                  textButton="Tìm kiếm"
                  placeholder="Tìm sản phẩm, danh mục hay thương hiệu mong muốn..."
                  allowClear
                  onChange={onSearch}
                />
              </Col>
            )}
            <Col
              span={24}
              className="text-white flex justify-center items-center mt-2"
            >
              <div className="flex justify-start items-center">
                {user?.access_token ? (
                  <Image
                    className="rounded-full object-cover"
                    width={40}
                    height={40}
                    src={user?.avatar}
                    fallback="https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-19.jpg"
                    preview={false}
                  />
                ) : (
                  <i className="fa-solid fa-user fa-2xl"></i>
                )}
              </div>
              <Loading isLoading={loading}>
                {user?.access_token ? (
                  <div className="flex flex-col px-2 text-sm">
                    <span>Xin chào,</span>
                    <Popover content={content} trigger="click">
                      <span className="w-28 truncate cursor-pointer hover:underline">
                        {userName}
                      </span>
                    </Popover>
                  </div>
                ) : (
                  <div className="flex flex-col px-2">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={handleLogin}
                    >
                      Đăng nhập / Đăng ký
                    </span>
                    <span>
                      Tài khoản <i className="fa-solid fa-caret-down fa-lg"></i>
                    </span>
                  </div>
                )}
              </Loading>

              {!isHiddenCart && (
                <div className="xl:px-5 flex ">
                  <Badge
                    count={5}
                    size="small"
                    className="flex justify-start items-center"
                  >
                    <i className="fa-solid fa-cart-shopping fa-2xl text-white"></i>
                  </Badge>
                  <span className="flex justify-start items-end max-xl:text-xs h-[35px]">
                    Giỏ hàng
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
