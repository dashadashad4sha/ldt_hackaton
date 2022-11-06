import { observer } from "mobx-react-lite";
import { FC, MouseEvent, useCallback } from "react";
import { TrashIcon } from "../../assets";
import { TnvedId } from "../../domain";
import useStore from "../../store";
import nullAvatar from "../../assets/img/null.png";
import s from "./styles.module.css";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config";
import TnvedDomain from "../../domain/tnved";

const Profile: FC = observer(() => {
  const navigator = useNavigate();
  const userStore = useStore("userStore");
  const { favorite } = userStore;
  const removeFavorite = useCallback(
    (id: TnvedId) => (e: MouseEvent) => {
      e.preventDefault();
      userStore.removeFromFavorite(id);
      e.stopPropagation();
    },
    [userStore]
  );

  const handleClickFavorite = useCallback(
    ({ tnvedCode, tnvedId }: TnvedDomain) =>
      () => {
        navigator(
          routes.analytic
            .replace(":code", tnvedCode.toString())
            .replace(":id", tnvedId.toString())
        );
      },
    [navigator]
  );

  return (
    <section className={clsx(s.wrapper, "container")}>
      <div className={s.favorite}>
        <h3 className={s.favoriteTitle}>СОХРАНЕННАЯ СТАТИСТИКА</h3>
        {favorite.length === 0 ? (
          "Нет избранных"
        ) : (
          <div className={s.favoriteList}>
            {favorite.map(({ tnvedCode, tnvedId, tnvedName }) => (
              <div
                className={clsx("block", s.card)}
                onClick={handleClickFavorite({ tnvedCode, tnvedId, tnvedName })}
                key={tnvedId}
              >
                <div className={s.cardInfo}>
                  <div className={clsx(s.cardCode)}>{tnvedCode}</div>
                  <div className={clsx(s.cardName)}>{tnvedName}</div>
                </div>
                <div
                  className={clsx(s.cardClear)}
                  onClick={removeFavorite(tnvedId)}
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={s.info}>
        <div className={s.infoAvatar}>
          <img src={nullAvatar} alt="avatar" />
        </div>
        <div className={s.infoName}>
          <h2>Пользователь</h2>
        </div>
      </div>
    </section>
  );
});

export default Profile;
