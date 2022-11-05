import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config";
import { Search } from "../../sections";
import useStore from "../../store";
import { Recommendations, Statistics } from "./sections";
import s from "./styles.module.css";

const Main: FC = observer(() => {
  const { user } = useStore("userStore");
  const navigator = useNavigate();
  useEffect(() => {
    if (!user.isLoading && !user.isAuthorized) {
      navigator(routes.auth);
    }
  }, [navigator, user.isAuthorized, user.isLoading]);
  return (
    <div className={s.wrapper}>
      <section className={s.search}>
        <Search />
      </section>
      <section>
        <Recommendations />
      </section>
      <section>
        <Statistics />
      </section>
    </div>
  );
});

export default Main;
