import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "../../config";
import { AnalyticsPage, AuthPage, MainPage, ProfilePage } from "../../pages";
import Layout from "../Layout";

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={routes.auth} element={<AuthPage />} />
          <Route path={routes.main} element={<MainPage />} />
          <Route path={routes.analytic} element={<AnalyticsPage />} />
          <Route path={routes.profile} element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
