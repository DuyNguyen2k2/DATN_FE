/* eslint-disable react/prop-types */

import { SearchOutlined } from "@ant-design/icons";
import { InputComponent } from "../InputComponent/InputComponent";
import { ButtonComponent } from "../ButtonComponent/ButtonComponent";

export const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
  } = props;
  return (
    <div>
      <div className="flex">
        <InputComponent
          className="rounded-none border-0"
          size={size}
          placeholder={placeholder}
          {...props}
        />
        <ButtonComponent
          className="rounded-none -ml-1 border-0 bg-[#0d5cb6] text-white"
          size={size}
          icon={<SearchOutlined />}
          textButton={textButton}
        />
      </div>
    </div>
  );
};
