import clsx from "clsx";
import { FC } from "react";
import AuthForm from "./form";
import s from './styles.module.css';

const Auth:FC = () => {
	return (
		<section className={s.wrapper}>
			<div className={clsx("block", s.block)}>
				<h1 className={s.title}>Авторизация</h1>
				<AuthForm />
			</div>
		</section>
	)
}

export default Auth;