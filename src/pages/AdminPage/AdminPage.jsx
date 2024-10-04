import { useState } from "react";
import {
  UserOutlined,
  ProductOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { getItem } from "../../utils";
import { Button, Col, Drawer, Menu, Row } from "antd";
import { HeaderComponent } from "../../components/HeaderComponent/HeaderComponent";
import { AdminUser } from "../../components/AdminUser/AdminUser";
import { AdminProduct } from "../../components/AdminProduct/AdminProduct";

const items = [
  getItem("Dashboard", "dashboard", <PieChartOutlined />),
  getItem("Người dùng", "user", <UserOutlined />),
  getItem("Sản phẩm", "product", <ProductOutlined />),
  //   {
  //     key: "user",
  //     label: "Người dùng",
  //     icon: <UserOutlined />,
  //     children: [
  //       {
  //         key: "5",
  //         label: "Option 5",
  //       },
  //       {
  //         key: "6",
  //         label: "Option 6",
  //       },
  //       {
  //         key: "7",
  //         label: "Option 7",
  //       },
  //       {
  //         key: "8",
  //         label: "Option 8",
  //       },
  //     ],
  //   },
  //   {
  //     key: "product",
  //     label: "Sản phẩm",
  //     icon: <ProductOutlined />,
  //     children: [
  //       {
  //         key: "9",
  //         label: "Option 9",
  //       },
  //       {
  //         key: "10",
  //         label: "Option 10",
  //       },
  //       {
  //         key: "sub3",
  //         label: "Submenu",
  //         children: [
  //           {
  //             key: "11",
  //             label: "Option 11",
  //           },
  //           {
  //             key: "12",
  //             label: "Option 12",
  //           },
  //         ],
  //       },
  //     ],
  //   },
];

export const AdminPage = () => {
  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      default:
        return <></>;
    }
  };
  const [keySelected, setKeySelected] = useState("");

  const handleOnclick = ({ key }) => {
    setKeySelected(key);
    onClose();
  };
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div className="min-[770px]:block hidden">
        <Row>
          <Col span={4}>
            <div className="h-max">
              <Menu
                className="hidden min-[770px]:block h-[100vh]"
                onClick={handleOnclick}
                mode="inline"
                items={items}
                defaultSelectedKeys={["dashboard"]}
                defaultOpenKeys={["dashboard"]}
              />
              <Button onClick={showDrawer} className="border-none">
                <i className="fa-solid fa-bars"></i>
              </Button>
              <Drawer
                placement="left"
                onClose={onClose}
                open={open}
                key="left"
                className="h-full w-max"
              >
                <Menu
                  className="min-[770px]:hidden block"
                  onClick={handleOnclick}
                  mode="inline"
                  items={items}
                  defaultSelectedKeys={["dashboard"]}
                  defaultOpenKeys={["dashboard"]}
                />
              </Drawer>
            </div>
          </Col>
          <Col span={20}>
            <div className="container mx-auto px-2 py-5">
              {renderPage(keySelected)}
            </div>
          </Col>
        </Row>
      </div>
      <div className="min-[770px]:hidden block">
        <Row>
          <Col span={24}>
            <div className="h-max">
              <Menu
                className="hidden min-[770px]:block h-[100vh]"
                onClick={handleOnclick}
                mode="inline"
                items={items}
                
              />
              <Button onClick={showDrawer} className="border-none">
                <i className="fa-solid fa-bars"></i>
              </Button>
              <Drawer
                placement="left"
                onClose={onClose}
                open={open}
                key="left"
                className="h-full w-max"
              >
                <Menu
                  className="min-[770px]:hidden block"
                  onClick={handleOnclick}
                  mode="inline"
                  items={items}
                  defaultSelectedKeys={["dashboard"]}
                  defaultOpenKeys={["dashboard"]}
                />
              </Drawer>
            </div>
          </Col>
          <Col span={24}>
            <div className="container mx-auto px-2 py-5">
              {renderPage(keySelected)}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
