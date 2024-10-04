
import { Result, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const {Paragraph, Text} = Typography

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <Result
      status="404"
      title="404 Not Found"
      subTitle={
        <Paragraph>
          <Text strong style={{ fontSize: '24px', display: 'block' }}>
            Không tìm thấy trang
          </Text>
          <Text style={{ fontSize: '18px', display: 'block' }}>
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ
          </Text>
        </Paragraph>
        
      }
      extra={<Button type="primary" onClick={handleBackHome}>Quay lại</Button>}
    />
  );
};
