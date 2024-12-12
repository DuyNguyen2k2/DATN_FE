/* eslint-disable react/prop-types */
import { Checkbox, Rate, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

export const NavBarComponent = ({ onFilterChange }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    rating: [],
  });

  const showDrawer = () => setIsDrawerVisible(true);
  const closeDrawer = () => setIsDrawerVisible(false);

  const handleStarClick = (value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev, rating: [value] }; // Cập nhật giá trị rating
      onFilterChange(newFilters); // Cập nhật bộ lọc
      return newFilters;
    });
  };

  const handleCheckboxChange = (checkedValues, type) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev, [type]: checkedValues }; // Cập nhật bộ lọc cho price
      onFilterChange(newFilters); // Cập nhật bộ lọc
      return newFilters;
    });
  };

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
          <Checkbox.Group
            className="flex flex-col mt-2"
            onChange={(value) => handleCheckboxChange(value, "price")}
            value={selectedFilters.price} // Sử dụng giá trị đã chọn để điều chỉnh checkbox
          >
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => (
          <div key={option} className="mt-2 cursor-pointer" onClick={() => handleStarClick(option)}>
            <Rate value={option} disabled={true} />
            <span> Từ {option} sao</span>
          </div>
        ));
      case "price":
        return options.map((option) => (
          <div key={option} className="mb-2 mt-2 cursor-pointer">
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
        />
      </div>

      {/* NavBar hiển thị dạng Drawer trên màn hình nhỏ */}
      <Drawer
        title="Danh mục"
        placement="left"
        onClose={closeDrawer}
        open={isDrawerVisible}
        styles={{ padding: "10px" }}
      >
        <div className="mt-5">
          <h1 className="font-semibold text-lg">Bộ lọc</h1>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h2 className="font-medium text-base">Giá</h2>
              {renderContent("checkbox", [
                { label: "Dưới 40.000", value: "under_40000" },
                { label: "40.000 -> 120.000", value: "40000_120000" },
                { label: "120.000 -> 400.000", value: "120000_400000" },
                { label: "400.000 -> 1.000.000", value: "400000_1000000" },
                { label: "Trên 1.000.000", value: "over_1000000" },
              ])}
            </div>
            <div>
              <h2 className="font-medium text-base">Đánh giá</h2>
              {renderContent("star", [5, 4, 3])}
            </div>
          </div>
        </div>
      </Drawer>

      {/* NavBar hiển thị bình thường trên màn hình lớn */}
      <div className="hidden md:block bg-white rounded shadow-md p-3">
        <div className="mt-5">
          <h1 className="font-semibold text-lg">Bộ lọc</h1>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h2 className="font-medium text-base">Giá</h2>
              {renderContent("checkbox", [
                { label: "Dưới 40.000", value: "under_40000" },
                { label: "40.000 -> 120.000", value: "40000_120000" },
                { label: "120.000 -> 400.000", value: "120000_400000" },
                { label: "400.000 -> 1.000.000", value: "400000_1000000" },
                { label: "Trên 1.000.000", value: "over_1000000" },
              ])}
            </div>
            <div>
              <h2 className="font-medium text-base">Đánh giá</h2>
              {renderContent("star", [5, 4, 3])}
            </div>
            <Button onClick={() => location.reload()}>Bỏ lọc</Button>
          </div>
        </div>
      </div>
    </>
  );
};