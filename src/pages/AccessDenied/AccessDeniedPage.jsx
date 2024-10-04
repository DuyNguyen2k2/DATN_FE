// src/pages/AccessDeniedPage/AccessDeniedPage.js

import { Result, Button, Typography  } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403 Forbidden"
      subTitle={
        <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Xin lỗi, bạn không có quyền truy cập trang này
        </Text>
      }
      extra={<Button type="primary" onClick={() => navigate('/')}>Quay lại</Button>}
    />
  );
};

export default AccessDeniedPage;
