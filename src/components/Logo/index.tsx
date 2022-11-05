import { FC } from "react";
import logo from "./logo.png";
import s from './styles.module.css';

const Logo: FC = () => (
  <div className={s.wrapper}>
    <div className={s.logoImage}>
      <img src={logo} alt="логотип" />
    </div>
    <div className={s.logoText}>
      <p>ДЕПАРТАМЕНТ ИНВЕСТИЦИОННОЙ И ПРОМЫШЛЕННОЙ ПОЛИТИКИ ГОРОДА МОСКВЫ</p>
    </div>
  </div>
);

export default Logo;
