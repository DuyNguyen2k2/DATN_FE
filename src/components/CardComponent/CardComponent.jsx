/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card } from "antd";
import official from "../../assets/images/official.png";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

export const CardComponent = (props) => {
  const {
    countInStock,
    description,
    image,
    name,
    price,
    rating,
    type,
    selled,
    discount,
    id,
    disabled,
  } = props;

  const isDisabled = countInStock === 0;
  const navigate = useNavigate();

  const handleDetailsProduct = (id) => {
    if (!isDisabled) {
      navigate(`/product-details/${id}`);
    }
  };

  return (
    <>
      <div className="relative">
      <Card
        className={`relative ${
          isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-white cursor-pointer"
        } mb-5 hidden md:block`}
        hoverable={!isDisabled}
        style={{
          width: "230px", // Chiều rộng cố định
          height: "400px",
        }}
        cover={
          <img
            className="object-cover h-48 w-full" // Sử dụng width: 100% để mở rộng ảnh tới chiều rộng card
            alt="product"
            src={image}
            style={{ objectFit: "contain" }} // Đảm bảo ảnh không bị méo
          />
        }
        onClick={() => handleDetailsProduct(id)}
      >
        <img
          src={official}
          alt=""
          className="w-[68px] h-auto absolute top-0 left-0"
        />
        <div className="text-lg">
          <p className="font-semibold line-clamp-2">{name}</p>
        </div>

        <div className="text-sm mb-2">
          <span>
            {rating || 0}{" "}
            <i className="fa-solid fa-star" style={{ color: "#FFD43B" }}></i>
          </span>
          <span> | </span>
          <span>Đã bán {selled || 0}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-base text-red-500">
            {convertPrice(price - price * (discount / 100))}{" "}
          </span>
          {discount > 0 && <span className="text-red-500"> -{discount}% </span>}
        </div>
      </Card>

      <Card
        className={`relative ${
          isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-white cursor-pointer"
        } md:hidden block mb-5`}
        hoverable={!isDisabled}
        style={{
          width: "350px", // Chiều rộng cố định
          height: "400px",
        }}
        cover={
          <img
            className="object-contain h-48 w-full" // Sử dụng width: 100% để mở rộng ảnh tới chiều rộng card
            alt="product"
            src={image}
            style={{ objectFit: "contain" }} // Đảm bảo ảnh không bị méo
          />
        }
        onClick={() => handleDetailsProduct(id)}
      >
        <img
          src={official}
          alt=""
          className="w-[68px] h-auto absolute top-0 left-0"
        />
        <div className="text-lg">
          <p className="font-semibold line-clamp-2">{name}</p>
        </div>

        <div className="text-sm mb-2">
          <span>
            {rating}{" "}
            <i className="fa-solid fa-star" style={{ color: "#FFD43B" }}></i>
          </span>
          <span> | </span>
          <span>Đã bán {selled || 0}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-red-500">
            {convertPrice(price - price * (discount / 100))}{" "}
          </span>
          {discount > 0 && <span className="text-red-500"> -{discount}% </span>}
        </div>
      </Card>

      {isDisabled && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-red-500 text-white font-bold p-2 z-10">
          Đã hết hàng
        </div>
      )}
    </div>
    </>
  );
};
