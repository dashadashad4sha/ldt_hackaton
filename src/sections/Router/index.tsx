import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "../../config";
import { AuthPage, MainPage } from "../../pages";
import Layout from "../Layout";

const Router: FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={routes.auth} element={<AuthPage />} />
          <Route path={routes.main} element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
