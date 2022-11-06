import { FC } from "react";
import s from "./styles.module.css";

const Loader:FC = () => (
  <div className={s["lds-ellipsis"]}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Loader;
