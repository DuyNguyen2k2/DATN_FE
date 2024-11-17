/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Breadcrumb,
  Button,
  Col,
  Image,
  InputNumber,
  notification,
  Rate,
  Row,
  Input,
  Form,
  Upload,
  Pagination,
  Modal,
  message,
} from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  MinusOutlined,
  UploadOutlined,
  StarOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import productImage from "../../assets/images/Iphone13.webp";
import { ButtonComponent } from "../ButtonComponent/ButtonComponent";
import * as ProductServices from "../../services/ProductServices";
import * as ReviewServices from "../../services/ReviewServices";
import { useQuery, useMutation } from "react-query";
import { Loading } from "../LoadingComponent/Loading";
import { useEffect, useState } from "react";
import "./style.css"; // Ensure this is included
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slices/orderSlice";
import { convertPrice, getBase64 } from "../../utils";
import { LikeComponent } from "../LikeComponent/LikeComponent";

export const ProductDetailsComponent = ({ idProduct }) => {
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    image: null,
  });
  const [reviews, setReviews] = useState([]); // Danh sách đánh giá
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Số đánh giá mỗi trang
  const [totalReviews, setTotalReviews] = useState(0); // Tổng số đánh giá
  const [isLoadingReviews, setIsLoadingReviews] = useState(false); // Loading trạng thái cho đánh giá
  const fetchGetData = async (context) => {
    const id = context.queryKey && context.queryKey[1];
    if (id) {
      const res = await ProductServices.getOneProduct(id);
      return res.data;
    }
  };

  const fetchReviews = async (page = 1, limit = 10) => {
    try {
      setIsLoadingReviews(true);
      const query = { product_id: idProduct, page, limit };
      const res = await ReviewServices.getReviews(user.accessToken, query);
      console.log("data", res.data);
      setReviews(res.data);
      setTotalReviews(res.total);
      setCurrentPage(page);
      return res.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (idProduct) {
      fetchReviews(currentPage, pageSize);
    }
  }, [idProduct, currentPage, pageSize]);

  // Xử lý thay đổi trang
  const handlePageChange = (page, pageSize) => {
    fetchReviews(page, pageSize);
  };

  const { isLoading, data: productDetails } = useQuery(
    ["productDetails", idProduct],
    fetchGetData,
    { enabled: !!idProduct }
  );

  const [numProducts, setNumProducts] = useState(1);
  const user = useSelector((state) => state.user);

  const onChange = (value) => {
    setNumProducts(Number(value));
  };

  const increment = () => {
    setNumProducts((prev) => {
      const newValue = prev + 1;
      if (newValue > productDetails?.countInStock) {
        notification.open({
          message: "Sản phẩm này hiện không đủ hàng",
          type: "warning",
        });
        return prev; // Keep the quantity as it is if stock is exceeded
      }
      onChange(newValue);
      return newValue;
    });
  };

  const decrement = () => {
    setNumProducts((prev) => {
      const newValue = Math.max(1, prev - 1);
      onChange(newValue);
      return newValue;
    });
  };

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      if (numProducts > productDetails?.countInStock) {
        notification.open({
          message: "Sản phẩm không đủ hàng",
          type: "error",
        });
        return;
      }
      if (order?.isSuccess) {
        notification.open({
          message: "Thêm vào giỏ hàng thành công",
          type: "success",
        });
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProducts,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInStock: productDetails?.countInStock,
            },
          })
        );
      } else if (order?.isError) {
        notification.open({
          message: "Có lỗi xảy ra khi thêm vào giỏ hàng",
          type: "error",
        });
      }
      return () => {
        dispatch(resetOrder());
      };
    }
  };

  const handleImageChange = async ({ fileList }) => {
    const MAX_SIZE = 5 * 1024 * 1024; // Giới hạn kích thước 5MB

    const images = [];

    for (const file of fileList) {
      if (file.originFileObj.size > MAX_SIZE) {
        notification.error({
          message: "Kích thước ảnh quá lớn",
          description: "Vui lòng chọn ảnh có kích thước nhỏ hơn 5MB.",
        });
        return;
      }

      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      images.push(file.preview); // Thêm ảnh vào mảng images
    }

    setUploadedImage(images); // Lưu danh sách base64 của ảnh
  };

  const handleReviewSubmit = async (values) => {
    try {
      const reviewData = {
        product_id: idProduct,
        user_id: user?.id, // Lấy ID người dùng từ Redux store
        rating: values.rating,
        content: values.comment,
        images: uploadedImage && uploadedImage.length > 0 ? uploadedImage : [], // Nếu có ảnh thì gửi
      };

      // Nếu sử dụng base64 cho ảnh, bạn cần gửi ảnh với thông tin định dạng phù hợp
      const response = await ReviewServices.createReview(
        user?.access_token,
        reviewData
      );

      notification.success({
        message: "Đánh giá của bạn đã được gửi!",
        description: response?.message || "Cảm ơn bạn đã đóng góp ý kiến.",
      });

      setUploadedImage([]); // Reset uploaded ảnh sau khi gửi
      setNewReview(reviewData); // Cập nhật review để hiển thị trên UI
    } catch (error) {
      notification.error({
        message: "Lỗi khi gửi đánh giá",
        description: error?.response?.data?.message || "Vui lòng thử lại sau.",
      });
    }
  };

  const desc = ["Cực kì tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"];

  const changAddress = () => {
    navigate("/user-profile");
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // Lưu trữ ảnh đã chọn
  const [form] = Form.useForm();

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setEditModalVisible(true);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.content,
    });
  };

  const handleUpdateReview = async (values) => {
    try {
      const updatedReview = {
        rating: values.rating,
        content: values.comment,
      };

      // Call API to update review
      const response = await ReviewServices.updateReview(
        user?.access_token,
        selectedReview._id,
        updatedReview
      );
      if (response.status === "OK") {
        message.success("Cập nhật đánh giá thành công!");
        setEditModalVisible(false); // Close modal
        // Optionally, you can refresh the review list after update.
      } else {
        message.error("Cập nhật đánh giá thất bại!");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật đánh giá.");
    }
  };

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedReviewToDelete, setSelectedReviewToDelete] = useState(null);

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await ReviewServices.deleteReview(
        user?.access_token,
        reviewId
      );
      if (response.status === "OK") {
        message.success("Đánh giá đã được xóa thành công!");
        setDeleteModalVisible(false); // Đóng modal sau khi xóa thành công
        // Refresh danh sách review sau khi xóa
        fetchReviews(); // Giả sử bạn có hàm này để tải lại danh sách reviews
      } else {
        message.error("Xóa đánh giá thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi khi xóa đánh giá.");
    }
  };

  // Mở modal khi nhấn vào icon xóa
  const showDeleteModal = (reviewId) => {
    setSelectedReviewToDelete(reviewId);
    setDeleteModalVisible(true);
  };

  // Đóng modal xác nhận xóa
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  return (
    <div className="container mx-auto px-2">
      <Loading isLoading={isLoading}>
        {productDetails && (
          <>
            <div className="py-2 w-full truncate">
              <Breadcrumb
                items={[
                  {
                    href: "/",
                    title: <HomeOutlined />,
                  },
                  {
                    title: productDetails.name,
                  },
                ]}
              />
            </div>
            <Row className="bg-[#fff] mt-2 rounded-md p-5 hidden sm:flex">
              <Col span={10} className="border-r">
                <Image src={productDetails.image} preview={false} />
                <div className="flex">
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                  <Image src={productDetails.image} preview={false} />
                </div>
              </Col>
              <Col span={14}>
                <div className="p-3 rounded">
                  <p className="text-2xl font-semibold break-words">
                    {productDetails.name}
                  </p>
                  <div className="mt-2 text-xl">
                    <span className="">
                      <StarOutlined className="text-yellow-500" />{" "}
                      {productDetails.rating || 0}/5
                    </span>
                    <span>
                      {" "}
                      ({productDetails.review_count || 0} đánh giá ){" "}
                    </span>
                    <span> | </span>
                    <span>Đã bán {productDetails.selled || 0}</span>
                  </div>
                  <div className="bg-[#FAFAFA] rounded font-bold text-2xl p-3 mt-5">
                    <p>{convertPrice(productDetails?.price)} </p>
                  </div>
                  <div className="p-5 mt-2 border-b border-t">
                    <span className="text-xl font-bold">Giao đến: </span>
                    <span className="text-xl">
                      <i>
                        {user?.address +
                          ", " +
                          user?.commune +
                          ", " +
                          user?.district +
                          ", " +
                          user?.city}
                      </i>
                    </span>
                    <span className="text-blue-400 cursor-pointer">
                      {" "}
                      -{" "}
                      <b className="hover:underline" onClick={changAddress}>
                        Đổi địa chỉ
                      </b>
                    </span>
                  </div>
                  <div className="p-5 mt-2 border-b">
                    <p className="text-lg">Số Lượng</p>
                    <div className="mt-2 flex items-center mb-2">
                      <Button onClick={decrement} className="custom-button">
                        <MinusOutlined />
                      </Button>
                      <InputNumber
                        onChange={onChange}
                        value={numProducts}
                        min={1}
                        className="rounded custom-input-number"
                      />
                      <Button onClick={increment} className="custom-button">
                        <PlusOutlined />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-5">
                    <ButtonComponent
                      className="rounded w-[200px]"
                      danger
                      type="primary"
                      textButton="Chọn Mua"
                      size="large"
                      onClick={handleAddOrderProduct}
                    />
                    <ButtonComponent
                      className="rounded w-[200px]"
                      textButton="Mua Trước Trả Sau"
                      size="large"
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Review Section */}
            <div className="mt-10 bg-white p-5 rounded-md">
              <h3 className="text-xl font-semibold">Đánh giá sản phẩm</h3>
              <Form
                onFinish={handleReviewSubmit}
                layout="vertical"
                className="mt-5"
              >
                <Form.Item
                  label="Số sao:"
                  name="rating"
                  rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
                >
                  <Rate allowHalf tooltips={desc} />
                </Form.Item>
                <Form.Item
                  label="Nội dung đánh giá:"
                  name="comment"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung đánh giá!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Viết đánh giá của bạn..."
                  />
                </Form.Item>
                <Form.Item label="Ảnh đánh giá:">
                  <Upload
                    listType="picture"
                    onChange={handleImageChange}
                    accept="image/*" // Chỉ nhận file ảnh
                    multiple // Cho phép tải lên nhiều ảnh
                  >
                    <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                  </Upload>
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi đánh giá
                </Button>
              </Form>
            </div>

            {/* Hiển thị đánh giá */}
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Các đánh giá</h3>
              <p>Tất cả đánh giá ({productDetails.review_count || 0})</p>
            </div>
            <div className="mt-5 bg-white">
              {isLoadingReviews ? (
                <p>Đang tải đánh giá...</p>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="mt-5 p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Image
                        width={50}
                        src={
                          review.user_id.avatar ||
                          "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
                        }
                        className="rounded-full"
                        preview={false}
                      />
                      <span className="font-bold">{review.user_id.name}</span>
                    </div>
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      allowHalf
                      className="mt-2"
                    />
                    <p className="mt-2">{review.content}</p>
                    {review.images?.length > 0 && (
                      <div className="mt-2 flex gap-2 items-center">
                        {review.images.map((img, index) => (
                          <Image key={index} src={img} width={100} />
                        ))}
                      </div>
                    )}
                    <div className="text-xl flex justify-end">
                      {/* Nếu user là chủ sở hữu đánh giá */}
                      {review.user_id._id === user.id && (
                        <>
                          <span
                            className="text-white bg-blue-400 cursor-pointer p-1 border flex items-center rounded"
                            onClick={() => handleEditReview(review)}
                          >
                            <EditFilled />
                          </span>
                        </>
                      )}
                      {/* Icon xóa: Luôn hiển thị nếu user là admin hoặc là chủ sở hữu đánh giá */}
                      {(user.isAdmin || review.user_id._id === user.id) && (
                        <span
                          className="text-white bg-red-400 cursor-pointer ml-2 p-1 border flex items-center rounded"
                          onClick={() => showDeleteModal(review._id)}
                        >
                          <DeleteFilled />
                        </span>
                      )}
                      <Modal
                        title="Xác nhận xóa đánh giá"
                        open={deleteModalVisible}
                        onOk={() => handleDeleteReview(selectedReviewToDelete)}
                        onCancel={handleCancelDelete}
                        okText="Xóa"
                        cancelText="Hủy"
                        cancelButtonProps={{ danger: true }}
                        styles={{
                          mask: { backgroundColor: "rgba(0, 0, 0, 0.1)" }, // Điều chỉnh độ mờ của lớp nền
                        }}
                      >
                        <p className="text-xl text-red-500">Bạn có chắc chắn muốn xóa đánh giá này không?</p>
                      </Modal>
                    </div>
                    <Modal
                      title="Chỉnh sửa đánh giá"
                      open={editModalVisible}
                      onCancel={() => setEditModalVisible(false)}
                      styles={{
                        mask: { backgroundColor: "rgba(0, 0, 0, 0.1)" }, // Điều chỉnh độ mờ của lớp nền
                      }}
                      footer={null}
                    >
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdateReview} // Add onFinish handler
                      >
                        <Form.Item
                          label="Số sao:"
                          name="rating"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn số sao!",
                            },
                          ]}
                        >
                          <Rate allowHalf />
                        </Form.Item>
                        <Form.Item
                          label="Nội dung đánh giá:"
                          name="comment"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung đánh giá!",
                            },
                          ]}
                        >
                          <Input.TextArea rows={4} />
                        </Form.Item>
                        {selectedReview?.images?.length > 0 && (
                          <div>
                            <h4>Danh sách ảnh đánh giá:</h4>
                            <div className="image-list flex gap-2 items-center">
                              {selectedReview.images.map((image, index) => (
                                <div key={index} className="image-item">
                                  <Image
                                    src={image}
                                    alt={`Image ${index}`}
                                    width={100}
                                    height={100}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upload mới ảnh */}
                        <Button type="primary" htmlType="submit">
                          Cập nhật
                        </Button>
                      </Form>
                    </Modal>
                  </div>
                ))
              ) : (
                <p className="p-2">Chưa có đánh giá nào.</p>
              )}
            </div>

            {/* Phân trang */}
            <Pagination
              className="py-5 flex items justify-center"
              current={currentPage}
              pageSize={pageSize}
              total={totalReviews}
              onChange={handlePageChange}
              showSizeChanger
              onShowSizeChange={(current, size) => setPageSize(size)}
            />
          </>
        )}
      </Loading>
    </div>
  );
};
