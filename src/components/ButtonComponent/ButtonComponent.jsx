import { Button } from "antd";

// eslint-disable-next-line react/prop-types
export const ButtonComponent = ({size, textButton, styleButton, ...rests}) => {
  return (
    <Button
      style={styleButton}
      size={size}
      {...rests}
    //   icon={<SearchOutlined />}
    >
      {textButton}
    </Button>
  );
};
