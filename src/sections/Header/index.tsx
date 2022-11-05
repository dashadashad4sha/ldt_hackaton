import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { LogoutIcon, UserIcon } from "../../assets";
import { Logo } from "../../components";
import useStore from "../../store";
import s from "./styles.module.css";

const Header: FC = observer(() => {
  const { user, authService } = useStore("userStore");

  const isAuthorized = useMemo(() => user.isAuthorized, [user.isAuthorized]);

  const handleDisconnect = useCallback(() => {
    authService.disconnect();
	toast.warn('Вы вышли из системы');
  }, [authService]);

  return (
    <div className={s.wrapper}>
      <div className={s.logoContainer}>
        <Logo />
      </div>
      {isAuthorized && (
        <nav className={s.navContainer}>
          <button className={clsx(s.profile, "button-blue", "icon-button")}>
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
