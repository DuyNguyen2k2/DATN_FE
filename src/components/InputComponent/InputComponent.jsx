/* eslint-disable react/prop-types */
import { Input } from "antd";

export const InputComponent = ( { size, placeholder, ...rest } ) => {
  return (
    <Input
      className="rounded-none border-0"
      size={size}
      placeholder={placeholder}
      {...rest}
    />
  );
};
