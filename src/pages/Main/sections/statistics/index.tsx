import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import useStore from "../../../../store";
import ImportExportGraph from "../importExport";
import TopPartners from "../topPartners";
import s from "./styles.module.css";

const Statistics = observer(() => {
  const mainDataStore = useStore("mainDataStore");
  const { user } = useStore("userStore");

  const { exportVolume, importVolume, partners, flags } = mainDataStore;

  useEffect(() => {
    if (user.isAuthorized) mainDataStore.getMainData();
  }, [mainDataStore, user.isAuthorized]);

  return (
    <section className={clsx("container", s.wrapper)}>
      <h1 className={s.title}>Таможенная статистика России</h1>
      {!flags.isLoading ? (
        <section className={s.graphs}>
          <ImportExportGraph
            exportData={exportVolume}
            importData={importVolume}
          />
          <TopPartners partners={partners} />
        </section>
      ) : (
        <h3 className={s.loading}>Загружаем данные</h3>
      )}
    </section>
  );
});

export default Statistics;
