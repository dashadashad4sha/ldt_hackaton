import { observer } from "mobx-react-lite";
import { FC, useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { routes } from "../../config";
import useStore from "../../store";
import Footer from "../Footer";
import Header from "../Header";
import s from "./styles.module.css";

const Layout: FC = observer(() => {
  const navigator = useNavigate();
  const { user, authService } = useStore("userStore");
  const federalDistrictsStore = useStore("federalDistrictsStore");

  useEffect(() => {
    if (!user.isLoading && user.isAuthorized) {
      navigator(routes.main);
    }
  }, [navigator, user.isAuthorized, user.isLoading]);

  const getInitialData = useCallback(async () => {
    await authService
      .verifyToken()
      .then(() => {
        federalDistrictsStore.getRegions();
      })
      .catch(() => navigator(routes.auth));
  }, [authService, federalDistrictsStore, navigator]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  return (
    <div className={s.wrapper}>
      <Header />
      <main className={s.body}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
});

export default Layout;
