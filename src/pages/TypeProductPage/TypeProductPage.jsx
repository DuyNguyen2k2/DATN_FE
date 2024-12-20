/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumb, Col, Pagination, Row, Empty } from "antd";
import { CardComponent } from "../../components/CardComponent/CardComponent";
import { NavBarComponent } from "../../components/NavBarComponent/NavBarComponent";
import { useLocation } from "react-router-dom";
import * as ProductServices from "../../services/ProductServices";
import { useEffect, useState } from "react";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { HomeOutlined } from "@ant-design/icons";

export const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const [filters, setFilters] = useState({
    price: [],
    rating: [],
  });

  const fetchProductsType = async (type, page, limit, filters) => {
    setLoading(true);
    const res = await ProductServices.getProductsType(type, page, limit);
    if (res?.status === "OK") {
      let filteredProducts = res?.data;

      // Lọc theo giá
      if (filters?.price?.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          return filters.price.some((range) => {
            // Kiểm tra giá theo checkbox
            if (range === "under_40000") {
              return product.price < 40000;
            } else if (range === "40000_120000") {
              return product.price >= 40000 && product.price <= 120000;
            } else if (range === "120000_400000") {
              return product.price >= 120000 && product.price <= 400000;
            } else if (range === "400000_1000000") {
              return product.price >= 400000 && product.price <= 1000000;
            } else if (range === "over_1000000") {
              return product.price > 1000000;
            }
          });
        });
      }

      // Lọc theo đánh giá
      if (filters?.rating?.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          return filters.rating.some((rating) => product.rating >= rating);
        });
      }

      setLoading(false);
      setProducts(filteredProducts); // Cập nhật sản phẩm sau khi lọc
      setPaginate({ ...paginate, total: filteredProducts.length });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductsType(state, paginate?.page, paginate?.limit, filters);
    }
  }, [state, paginate?.page, paginate?.limit, filters]);

  const onChange = (current, pageSize) => {
    setPaginate({ ...paginate, page: current - 1, limit: pageSize });
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <Loading isLoading={loading}>
      <div className="container-2xl bg-[#efefef] min-h-screen">
        <div className="container mx-auto">
          <div className="pt-3 pb-2 w-full truncate">
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: <HomeOutlined />,
                },
                {
                  title: `${state}`,
                },
              ]}
            />
          </div>
          <Row>
            <Col xs={24} md={4} className="bg-[#fff] rounded h-max p-3 mb-5">
              <NavBarComponent onFilterChange={handleFilterChange} />
            </Col>
            <Col xs={24} md={20}>
              <div className="px-3 rounded mb-5">
                {/* Điều chỉnh flex để canh giữa Empty khi không có sản phẩm */}
                {products?.filter((product) => {
                  if (searchDebounce === "") {
                    return product;
                  } else if (
                    product?.name.toLowerCase().includes(searchDebounce.toLowerCase())
                  ) {
                    return product;
                  }
                }).length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <Empty description="Không có sản phẩm nào được tìm thấy" />
                  </div>
                ) : (
                  <div>
                    {products
                      ?.filter((product) => {
                        if (searchDebounce === "") {
                          return product;
                        } else if (
                          product?.name
                            .toLowerCase()
                            .includes(searchDebounce.toLowerCase())
                        ) {
                          return product;
                        }
                      })
                      .map((product) => {
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
                      })
                    }
                  </div>
                )}
              </div>
  
              {/* Canh giữa Pagination */}
              <div className="flex justify-center w-full">
                <Pagination
                  className="flex items-center"
                  defaultCurrent={1}
                  current={paginate.page + 1}
                  total={paginate.total}
                  pageSize={paginate.limit}
                  showSizeChanger
                  onChange={onChange}
                  onShowSizeChange={onChange}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
  
};
