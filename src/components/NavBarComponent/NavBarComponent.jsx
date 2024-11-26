import { Checkbox, Rate, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

export const NavBarComponent = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => setIsDrawerVisible(true);
  const closeDrawer = () => setIsDrawerVisible(false);

  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => (
          <h1 key={option} className="text-sm mt-2">
            {option}
          </h1>
        ));
      case "checkbox":
        return (
          <Checkbox.Group className="flex flex-col mt-2">
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => (
          <div key={option} className="mt-2">
            <Rate value={option} disabled />
            <span> Từ {option} sao</span>
          </div>
        ));
      case "price":
        return options.map((option) => (
          <div key={option} className="mb-2 mt-2">
            <span className="bg-[#ccc] px-2 py-1 rounded-full">{option}</span>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <>
      {/* Nút menu hiển thị trên màn hình nhỏ */}
      <div className="md:hidden mb-3">
        <Button
          icon={<MenuOutlined />}
          type="primary"
          onClick={showDrawer}
          className="flex items-center"
        >
        </Button>
      </div>

      {/* NavBar hiển thị dạng Drawer trên màn hình nhỏ */}
      <Drawer
        title="Danh mục"
        placement="left"
        onClose={closeDrawer}
        open={isDrawerVisible}
        styles={{ padding: "10px" }}
      >
        <div>
          <h1 className="font-semibold text-lg">Danh mục</h1>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {renderContent("text", ["TV", "Tủ Lạnh", "Máy Giặt"])}
          </div>
        </div>
        <div className="mt-5">
          <h1 className="font-semibold text-lg">Bộ lọc</h1>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h2 className="font-medium text-base">Giá</h2>
              {renderContent("price", [
                "Dưới 40.000",
                "40.000 -> 120.000",
                "120.000 -> 400.000",
                "Trên 400.000",
              ])}
            </div>
            <div>
              <h2 className="font-medium text-base">Đánh giá</h2>
              {renderContent("star", [5, 4, 3])}
            </div>
            <div>
              <h2 className="font-medium text-base">Loại</h2>
              {renderContent("checkbox", [
                { value: "a", label: "Loại A" },
                { value: "b", label: "Loại B" },
              ])}
            </div>
          </div>
        </div>
      </Drawer>

      {/* NavBar hiển thị bình thường trên màn hình lớn */}
      <div className="hidden md:block bg-white rounded shadow-md p-3">
        <div>
          <h1 className="font-semibold text-lg">Danh mục</h1>
          <div className="flex flex-wrap gap-2">
            {renderContent("text", ["TV", "Tủ Lạnh", "Máy Giặt"])}
          </div>
        </div>
        <div className="mt-5">
          <h1 className="font-semibold text-lg">Bộ lọc</h1>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h2 className="font-medium text-base">Giá</h2>
              {renderContent("price", [
                "Dưới 40.000",
                "40.000 -> 120.000",
                "120.000 -> 400.000",
                "Trên 400.000",
              ])}
            </div>
            <div>
              <h2 className="font-medium text-base">Đánh giá</h2>
              {renderContent("star", [5, 4, 3])}
            </div>
            <div>
              <h2 className="font-medium text-base">Loại</h2>
              {renderContent("checkbox", [
                { value: "a", label: "Loại A" },
                { value: "b", label: "Loại B" },
              ])}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
