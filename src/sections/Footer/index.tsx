import { FC } from "react";
import { Pattern } from "../../components";
import s from './styles.module.css';

const Footer: FC = () => {
  return (
    <footer className={s.wrapper}>
      <Pattern />
    </footer>
  );
};

export default Footer;
