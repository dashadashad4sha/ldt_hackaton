import { FC } from "react";
import pattern from "./pattern.png";
import s from './styles.module.css';

const Pattern: FC = () => (
  <div className={s.wrapper}>
    <img src={pattern} alt="pattern" />
  </div>
);

export default Pattern;
