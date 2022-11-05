import clsx from "clsx";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config";
import RecommendationsDomain from "../../domain/recommendations";
import Copy from "../Copy";
import s from "./styles.module.css";

type RecommendationCardProps = { place: number } & RecommendationsDomain;
const RecommendationCard: FC<RecommendationCardProps> = ({
  place,
  tnvedCode,
  tnvedName,
}) => {
  const navigator = useNavigate();

  const handleClick = useCallback(() => {
    navigator(routes.analytic.replace(":id", tnvedCode));
  }, [navigator, tnvedCode]);

  return (
    <section
      onClick={handleClick}
      tabIndex={0}
      className={clsx("block", s.wrapper)}
    >
      <div className={s.place}>{place}</div>
      <div className={s.tnved}>
        тн вэд:
        <Copy value={tnvedCode}>
          <span className={s.code}>{tnvedCode}</span>
        </Copy>
      </div>
      <div className={s.name}>{tnvedName}</div>
    </section>
  );
};

export default RecommendationCard;
