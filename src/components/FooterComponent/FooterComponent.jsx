export const FooterComponent = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo and Contact Information */}
          <div>
            <p className="text-xl font-bold">TECHTROVEDECOR</p>
            <p className="text-sm">Hỗ trợ tổng đài: 1900 1903</p>
            <p className="text-sm">Mua hàng: 1900 1903</p>
            <p className="text-sm">Khuyến mãi: 1900 1903</p>
            <div className="flex space-x-4 mt-4">
              {/* Payment Methods */}
              <img src="https://logos-download.com/wp-content/uploads/2016/03/PayPal_Logo_2007.png" alt="PayPal" className="h-6" />
              <img src="https://assets.topdev.vn/images/2020/08/25/VNPAY-Logo-yGapP.png" alt="VNPay" className="h-6" />
              <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" alt="Visa" className="h-6" />
              <img src="https://th.bing.com/th/id/R.a4bd3202cecefadc1b07ee359f856780?rik=rLDO2zSNggmU4Q&pid=ImgRaw&r=0" alt="MasterCard" className="h-6" />
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Giới thiệu Techtrove Decor</h2>
            <ul>
              <li><a href="#" className="hover:text-primary">Giới thiệu công ty</a></li>
              <li><a href="#" className="hover:text-primary">Liên hệ hợp tác kinh doanh</a></li>
              <li><a href="#" className="hover:text-primary">Thông tin tuyển dụng</a></li>
              <li><a href="#" className="hover:text-primary">Tin công nghệ</a></li>
              <li><a href="#" className="hover:text-primary">Tin tức</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h2>
            <ul>
              <li><a href="#" className="hover:text-primary">Tra cứu đơn hàng</a></li>
              <li><a href="#" className="hover:text-primary">Hướng dẫn mua hàng trực tuyến</a></li>
              <li><a href="#" className="hover:text-primary">Hướng dẫn thanh toán</a></li>
              <li><a href="#" className="hover:text-primary">Hướng dẫn mua hàng trả góp</a></li>
              <li><a href="#" className="hover:text-primary">In hóa đơn điện tử</a></li>
              <li><a href="#" className="hover:text-primary">Góp ý, Khiếu Nại</a></li>
            </ul>
          </div>

          {/* Policies & Social Media */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Chính sách chung</h2>
            <ul>
              <li><a href="#" className="hover:text-primary">Chính sách, quy định chung</a></li>
              <li><a href="#" className="hover:text-primary">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-primary">Chính sách giao hàng</a></li>
              <li><a href="#" className="hover:text-primary">Bảo mật thông tin khách hàng</a></li>
              <li><a href="#" className="hover:text-primary">Chính sách nhập lại tính phí</a></li>
            </ul>
            <div className="mt-4 flex space-x-4">
              {/* Social Media Links */}
              <a href="#" className="text-xl hover:text-primary"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-xl hover:text-primary"><i className="fab fa-youtube"></i></a>
              <a href="#" className="text-xl hover:text-primary"><i className="fab fa-tiktok"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white py-4 mt-8">
        <div className="text-center">
          <p className="text-sm">&copy; 2024 Techtrove Decor. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
