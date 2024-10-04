/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routes } from "./routes";
import { DefaultComponent } from "./components/DefaultComponent/DefaultComponent";
import { Fragment, useEffect, useState } from "react";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "../src/services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../src/redux/slices/userSlice";
import { Loading } from "./components/LoadingComponent/Loading";
import AccessDeniedPage from "./pages/AccessDenied/AccessDeniedPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetOneUser(decoded.id, storageData);
    }
    setIsLoading(false);
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  const handleGetOneUser = async (id, token) => {
    const res = await UserService.getOneUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
    
  };

  return (
    <>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const ischeckAuth = !route.isPrivate || user.isAdmin;
              const Layout = route.isShowHeader && route.isShowFooter ? DefaultComponent : Fragment;

              // return (
              //   <Route
              //     exact
              //     key={route.path}
              //     path={route.path}
              //     element={
              //       ischeckAuth ? (
              //         <Layout>
              //           <Page />
              //         </Layout>
              //       ) : (
              //         <Navigate to="/access-denied" />
              //       )
              //     }
              //   />
              // );

              return (
                <Route
                  exact
                  key={route.path}
                  path={ischeckAuth ? route.path : "/access-denied"}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
            {/* <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Router>
      </Loading>
    </>
  );
}

export default App;
