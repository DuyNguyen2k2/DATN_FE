import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import * as ProductService from "../../services/ProductServices";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { Loading } from "../../components/LoadingComponent/Loading";
import { SliderComponent } from "../../components/SliderComponent/SliderComponent";
import { TypeProduct } from "../../components/TypeProduct/TypeProduct";
import { CardComponent } from "../../components/CardComponent/CardComponent";
import { ButtonComponent } from "../../components/ButtonComponent/ButtonComponent";
import Slider1 from "../../assets/images/slide1.webp";
import Slider2 from "../../assets/images/slide2.webp";
import Slider3 from "../../assets/images/slide3.webp";
import Slider4 from "../../assets/images/slide4.webp";
import Slider5 from "../../assets/images/slide5.webp";
import Slider6 from "../../assets/images/slide6.webp";

export const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [isLoadingSearch, setLoadingSearch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Thêm state loading cho nút "Xem thêm"
  const [limit, setLimit] = useState(12);
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchProducts = async (context) => {
    const search = context.queryKey && context.queryKey[2];
    const limit = context.queryKey && context.queryKey[1];
    const res = await ProductService.getAllProducts(search, limit);
    return res;
  };

  const fetchAllType = async () => {
    const res = await ProductService.getAllType();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  const { isLoading, data: products } = useQuery(
    ["products", limit, searchDebounce],
    fetchProducts,
    {
      retry: 3,
      retryDelay: 500,
      keepPreviousData: true,
      onSettled: () => setIsLoadingMore(false), // Tắt loading sau khi query kết thúc
    }
  );

  useEffect(() => {
    setLoadingSearch(true);
    fetchAllType();
    setLoadingSearch(false);
  }, [searchDebounce]);

  const handleLoadMore = () => {
    setIsLoadingMore(true); // Bật trạng thái loading
    setLimit((prev) => prev + 6); // Tăng limit
  };

  return (
    <div>
      
        <div className="container-2xl shadow bg-white">
          <div className="container mx-auto flex flex-wrap items-center h-auto px-2">
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </div>
        </div>
        <div className="bg-[#efefef]">
          <div className="container mx-auto">
            <SliderComponent
              arrImages={[Slider1, Slider2, Slider3, Slider4, Slider5, Slider6]}
            />
            <Loading isLoading={isLoadingSearch || isLoading}>
            <div className="p-2 mt-10 flex max-md:justify-center max-md:items-center md:gap-7 flex-wrap min-h-screen">
              {products?.data.map((product) => (
                <div
                  className="flex justify-center items-center"
                  key={product._id}
                >
                  <CardComponent
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                </div>
              ))}
            </div>
            </Loading>
            <div className="flex justify-center items-center mt-4">
              <ButtonComponent
                textButton="Xem thêm"
                size="large"
                type="primary"
                className="rounded mb-5"
                loading={isLoadingMore} // Hiển thị trạng thái loading
                disabled={
                  isLoadingMore ||
                  products?.total === products?.data?.length ||
                  products?.totalPage === 1
                }
                onClick={handleLoadMore}
              />
            </div>
          </div>
        </div>
      
    </div>
  );
};
