import { useState } from 'react';
import { forgotPassword } from '../../services/UserServices'; // Giả sử bạn đã import API đúng
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email });
      setMessage(response.message); // Hiển thị thông báo thành công
      notification.success({
        message: "Success",
        description: response.message || "Password changed successfully!",
      });
    } catch (error) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Gửi yêu cầu
          </button>
          <button className="w-full py-2 px-4  rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={() => navigate('/sign-in')}>
            Quay lại
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
