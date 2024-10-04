/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Pagination, Row } from "antd";
import { CardComponent } from "../../components/CardComponent/CardComponent";
import { NavBarComponent } from "../../components/NavBarComponent/NavBarComponent";
import { useLocation } from "react-router-dom";
import * as ProductServices from "../../services/ProductServices";
import { useEffect, useState } from "react";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";


export const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  })
  const fetchProductsType = async (type, page, limit) => {
    setLoading(true)
    const res = await ProductServices.getProductsType(type, page, limit);
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPaginate({...paginate, total: res?.total})
    }
    else{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductsType(state, paginate?.page, paginate?.limit);
    }
  }, [state, paginate?.page, paginate?.limit]);

  const onChange = (current, pageSize) => {
    setPaginate({...paginate, page: current - 1, limit: pageSize})
  }

  return (
    <Loading isLoading={loading}>
    <div className="container-2xl bg-[#efefef]">
      <div className="container mx-auto">
        <Row>
          <Col span={4} className="bg-[#fff] p-3 rounded my-5 h-max">
            <NavBarComponent />
          </Col>
          <Col span={20}>
            <div className=" p-3 rounded flex items-center flex-wrap gap-2 my-5">
              {products?.filter((product) => {
                if(searchDebounce === ''){
                  return product
                }else if(product?.name.toLowerCase().includes(searchDebounce.toLowerCase())){
                  return product
                }
              }).map((product) => {
                return (
                  <CardComponent
                    key={product._id}
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
                );
              })}
            </div>
            <div className="flex justify-center items-center mb-10">
              <Pagination defaultCurrent={paginate?.page + 1} total={paginate?.total} onChange={onChange}/>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    </Loading>
  );
};
