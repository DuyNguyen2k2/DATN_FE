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
    id
  } = props;

  const navigate = useNavigate()

  const handleDetailsProduct = (id) => {
      navigate(`/product-details/${id}`)
  }
  
  return (
    <>
      <Card
        className="relative hidden min-[770px]:block"
        hoverable
        style={{
          width: 230,
          height: 400,
        }}
        cover={
          <img className="object-contain"
            alt="product"
            src={image}
            style={{ height: "250px"}}
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
          <span>Đã bán {selled || 1000}</span>
        </div>

        <div className="flex items-center">
          <span className="font-bold text-lg text-red-500">{convertPrice(price - (price*(discount/100)))} </span>
          
          {discount > 0 && <span className="text-red-500"> -{discount}% </span>}
        </div>
      </Card>
      <Card
        className="relative min-[770px]:hidden block"
        hoverable
        style={{
          width: 170,
        }}
        cover={
          <img
            alt="example"
            src={image}
            className="h-[170px] object-contain"
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
          <span>Đã bán {selled || 1000}</span>
        </div>

        <div className="flex items-center">
          <span className="font-bold text-lg text-red-500">{price.toLocaleString()} đ </span>
          <span className="text-red-500"> -{discount || 5}%</span>
        </div>
      </Card>
    </>
  );
};
