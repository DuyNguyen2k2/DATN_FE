/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import { Image } from "antd";
import Slider from "react-slick";
export const SliderComponent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <Slider {...settings}>
      {arrImages.map((image) => {
        return <Image src={image} key={image} preview={false} width="100%"/>;
      })}
    </Slider>
  );
};
