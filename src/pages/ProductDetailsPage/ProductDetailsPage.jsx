
import { ProductDetailsComponent } from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useParams } from "react-router-dom";
export const ProductDetailsPage = () => {
  const {id} = useParams()
  
  return (
    <div className="container-2xl bg-[#efefef]">
      <div className="container mx-auto">
        <div className="">
          <ProductDetailsComponent idProduct={id}/>
        </div>
      </div>
    </div>
  );
};
