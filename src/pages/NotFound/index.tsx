import clsx from "clsx";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../../config";
import s from "./styles.module.css";

const NotFound: FC = () => (
  <div className={s.wrapper}>
    <h1 className={s.title}>404</h1>
    <h3 className={s.subtitle}>Страница не найдена</h3>
    <NavLink className={clsx(s.link, "button-blue")} to={routes.main}>
      На главную
    </NavLink>
  </div>
);
export default NotFound;
