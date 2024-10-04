import { message } from "antd";

const [messageApi, contextHolder] = message.useMessage();
const success = (mes) => {
  messageApi.open({
    type: "success",
    content: mes,
  });
};
const error = (mes) => {
  messageApi.open({
    type: "error",
    content: mes,
  });
};
const warning = (mes) => {
  messageApi.open({
    type: "warning",
    content: mes,
  });
};

export { success, error, warning, contextHolder};
