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
        className={`relative hidden min-[770px]:block ${
          isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-white cursor-pointer"
        }`}
        hoverable={!isDisabled}
        style={{
          width: 230,
          height: 400,
        }}
        cover={
          <img
            className="object-contain"
            alt="product"
            src={image}
            style={{ height: "250px" }}
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
          <p className="font-semibold w-[200px] line-clamp-2">{name}</p>
        </div>

        <div className="text-sm mb-2">
          <span>
            {rating}{" "}
            <i className="fa-solid fa-star" style={{ color: "#FFD43B" }}></i>
          </span>
          <span> | </span>
          <span>Đã bán {selled || 0}</span>
        </div>

        <div className="flex items-center">
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

      <Card
        className="relative min-[770px]:hidden block"
        hoverable
        style={{
          width: 170,
        }}
        cover={
          <img alt="example" src={image} className="h-[170px] object-contain" />
        }
        onClick={() => handleDetailsProduct(id)}
      >
        <img
          src={official}
          alt=""
          className="w-[68px] h-auto absolute top-0 left-0"
        />
        <div className="text-lg">
          <p className="font-semibold w-[200px] line-clamp-2">{name}</p>
        </div>

        <div className="text-sm mb-2">
          <span>
            {rating}{" "}
            <i className="fa-solid fa-star" style={{ color: "#FFD43B" }}></i>
          </span>
          <span> | </span>
          <span>Đã bán {selled || 1000}</span>
        </div>

        <div className="flex items-center">
          <span className="font-bold text-lg text-red-500">
            {price.toLocaleString()} đ{" "}
          </span>
          <span className="text-red-500"> -{discount || 5}%</span>
        </div>
      </Card>
    </>
  );
};
