import { FC } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../../config";
import logo from "./logo.png";
import s from './styles.module.css';

const Logo: FC = () => (
  <div className={s.wrapper}>
    <NavLink to={routes.main} className={s.logoImage}>
      <img src={logo} alt="логотип" />
    </NavLink>
    <div className={s.logoText}>
      <p>ДЕПАРТАМЕНТ ИНВЕСТИЦИОННОЙ И ПРОМЫШЛЕННОЙ ПОЛИТИКИ ГОРОДА МОСКВЫ</p>
    </div>
  </div>
);

export default Logo;
