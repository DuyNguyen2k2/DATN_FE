import AccessDeniedPage from "../pages/AccessDenied/AccessDeniedPage";
import { AdminPage } from "../pages/AdminPage/AdminPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { OrderPage } from "../pages/OrderPage/OrderPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage/ProductDetailsPage";
import { ProductPage } from "../pages/ProductPage/ProductPage";
import { SignInPage } from "../pages/SignInPage/SignInPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";
import { TypeProductPage } from "../pages/TypeProductPage/TypeProductPage";
import { UserProfilePage } from "../pages/UserProfilePage/UserProfilePage";
import { PaymentPage } from "../pages/PaymentPage/PaymentPage";
import { OrderSuccess } from "../pages/OrderSuccess/OrderSuccess";
import { MyOrderPage } from "../pages/MyOrderPage/MyOrderPage";
import { DetailsOrderPage } from "../pages/DetailsOrderPage/DetailsOrderPage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/my-orders",
    page: MyOrderPage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/orderSuccess",
    page: OrderSuccess,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/details-order/:id",
    page: DetailsOrderPage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/products",
    page: ProductPage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "products/:type",
    page: TypeProductPage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
    isShowFooter: false,
    isShowChatbot: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
    isShowFooter: false,
    isShowChatbot: false,
  },
  {
    path: "/product-details/:id",
    page: ProductDetailsPage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/user-profile",
    page: UserProfilePage,
    isShowHeader: true,
    isShowFooter: true,
    isShowChatbot: true,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
    isShowFooter: false,
    isShowChatbot: false,
  },
  {
    path: "/access-denied",
    page: AccessDeniedPage,
    isShowHeader: false,
    isShowFooter: false,
    isShowChatbot: false,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
    isShowFooter: false,
    isShowChatbot: false,
  },
];
