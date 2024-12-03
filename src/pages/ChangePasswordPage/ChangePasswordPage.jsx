import { Form, Input, Button, Typography, notification } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { changePassword } from "../../services/UserServices";
import { useNavigate } from "react-router-dom"; // Thêm import này

const { Title } = Typography;

export const ChangePasswordPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const onFinish = async (values) => {
    try {
      const access_token = user?.access_token;
      if (!access_token) {
        return notification.error({
          message: "Authorization Error",
          description: "You need to log in again!",
        });
      }

      const response = await changePassword(access_token, {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      notification.success({
        message: "Success",
        description: response.message || "Password changed successfully!",
      });
    } catch (error) {
      console.error("Change password error:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  // Hàm quay lại trang chủ
  const goToHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <Title level={3} className="text-center">
          Change Password
        </Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          className="space-y-4"
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please enter your current password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Current Password"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm New Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đổi mật khẩu
            </Button>
          </Form.Item>

          {/* Nút quay lại trang chủ */}
          <Form.Item>
            <Button
              type="default"
              onClick={goToHome}
              className="w-full mt-4"
            >
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
