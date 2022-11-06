import clsx from "clsx";
import { FC } from "react";
import RecommendationsDomain from "../../domain/recommendations";
import Copy from "../Copy";
import s from "./styles.module.css";

type RecommendationCardProps = { place: number } & RecommendationsDomain;
const RecommendationCard: FC<RecommendationCardProps> = ({
  place,
  tnvedCode,
  tnvedName,
}) => {
  return (
    <section
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
