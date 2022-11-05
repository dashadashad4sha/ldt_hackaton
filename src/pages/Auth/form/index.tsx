import { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import s from "./styles.module.css";
import clsx from "clsx";
import useStore from "../../../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../config";
import { observer } from "mobx-react-lite";

const defaultValues = {
  username: "",
  password: "",
};

const AuthForm: FC = observer(() => {
  const navigator = useNavigate();
  const userStore = useStore("userStore");

  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        await userStore.authService.login(data);
        toast.success(`Вы вошли в систему как ${data.username}`);
		navigator(routes.main);
      } catch (err: any) {
        toast.error(err.data.detail || "Ошибка");
      }
    },
    [navigator, userStore.authService]
  );

  return (
    <form className={s.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <input className={s.input} {...register("username")} />
      <input className={s.input} {...register("password")} type="password" />
      <button className={clsx("button-blue", s.button)} type="submit">
        Вход
      </button>
    </form>
  );
});

export default AuthForm;
