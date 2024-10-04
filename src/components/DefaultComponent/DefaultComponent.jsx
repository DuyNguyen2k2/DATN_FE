import { FooterComponent } from "../FooterComponent/FooterComponent";
import { HeaderComponent } from "../HeaderComponent/HeaderComponent";

// eslint-disable-next-line react/prop-types
export const DefaultComponent = ({ children }) => {
  return (
    <div>
      <div className="">
        <HeaderComponent />
      </div>
      {children}
      <div className="">
        <FooterComponent/>
      </div>
    </div>
  );
};
