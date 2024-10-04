import { Checkbox, Rate } from "antd";
export const NavBarComponent = () => {
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          // eslint-disable-next-line react/jsx-key
          return <h1 className="text-sm mt-2">{option}</h1>;
        });
      case "checkbox":
        return (
          <Checkbox.Group className="flex flex-col mt-2">
            {options.map((option) => {
              // eslint-disable-next-line react/jsx-key
              return <Checkbox value={option.value}>{option.label}</Checkbox>;
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div className="mt-2">
              <Rate value={option} disabled />
              <span> Từ {option} sao</span>
            </div>
          );
        });
    case 'price':
        return options.map((option) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div className="mb-2 mt-2">
              <span className="bg-[#ccc] px-2 py-1 rounded-full">{option}</span>
            </div>
          );
        });
      default:
        return {};
    }
  };
  return (
    <div>
      <div>
        <h1 className="font-semibold text-lg">lable</h1>
        {renderContent("text", ["TV", "Tủ Lạnh", "Máy Giặt"])}
      </div>
      {/* <div>
        <h1 className="font-semibold text-lg">lable</h1>
        {renderContent("checkbox", [
          {
            value: "a",
            label: "A",
          },
          {
            value: "b",
            label: "B",
          },
        ])}
      </div>
      <div>
        <h1 className="font-semibold text-lg">lable</h1>
        {renderContent("star", [5, 4, 3])}
      </div>
      <div>
        <h1 className="font-semibold text-lg">lable</h1>
        {renderContent("price", ['Dưới 40.000', '40.000 -> 120.000', '120.000 -> 400.000', 'Trên 400.000'])}
      </div> */}
    </div>
  );
};
