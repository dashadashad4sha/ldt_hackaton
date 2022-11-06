import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogoutIcon, UserIcon } from "../../assets";
import { Logo } from "../../components";
import { routes } from "../../config";
import useStore from "../../store";
import Search from "../Search";
import s from "./styles.module.css";

const Header: FC = observer(() => {
  const navigator = useNavigate();
  const { user, authService } = useStore("userStore");
  const location = useLocation();

  const isAuthorized = useMemo(() => user.isAuthorized, [user.isAuthorized]);

  const handleDisconnect = useCallback(() => {
    authService.disconnect();
    toast.warn("Вы вышли из системы");
  }, [authService]);

  const handleProfile = useCallback(() => {
    navigator(routes.profile);
  }, [navigator]);

  const renderSearch = useMemo(() => {
    return !(
      location.pathname.includes(routes.auth) ||
      location.pathname.includes(routes.main)
    );
  }, [location.pathname]);

  return (
    <div className={s.wrapper}>
      <div className={s.logoContainer}>
        <Logo />
      </div>
      {renderSearch && (
        <div className={s.search}>
          <Search />
        </div>
      )}
      {isAuthorized && (
        <nav className={s.navContainer}>
          <button
            onClick={handleProfile}
            className={clsx(s.profile, "button-blue", "icon-button")}
          >
            <UserIcon />
          </button>
          <button
            onClick={handleDisconnect}
            className={clsx(s.logout, "icon-button")}
          >
            <LogoutIcon />
          </button>
        </nav>
      )}
    </div>
  );
});

export default Header;
