import { FC, useCallback, useMemo } from "react";
import MainDataStore from "../../../../store/mainData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { keyBy, merge, values } from "lodash";
import dayjs from "dayjs";
import { numberFormatter } from "../../../../utils";
import clsx from "clsx";
import s from './styles.module.css';

type ImportExportGraphProps = {
  importData: MainDataStore["importVolume"];
  exportData: MainDataStore["exportVolume"];
};

const legendNameMap = {
  export: "Экспорт",
  import: "Импорт",
};

const ImportExportGraph: FC<ImportExportGraphProps> = ({
  importData,
  exportData,
}) => {
  const hasData = useMemo(
    () => importData.status || exportData.status,
    [exportData.status, importData.status]
  );

  const data = useMemo(() => {
    const mergedData = merge(
      keyBy(
        importData.data.map((val) => ({ ...val, importVolume: val.volume })),
        "period"
      ),
      keyBy(
        exportData.data.map((val) => ({ ...val, exportVolume: val.volume })),
        "period"
      )
    );
    const graphValue = values(mergedData);
    return graphValue.map(({ period, exportVolume, importVolume }) => ({
      name: dayjs(period).format("DD-MM-YYYY"),
      export: exportVolume || 0,
      import: importVolume || 0,
    }));
  }, [exportData.data, importData.data]);

  const YTickFormatter = useCallback(
    (tick: string) => numberFormatter(parseFloat(tick)),
    []
  );

  const tooltipFormatter = useCallback((value: string) => {
    return numberFormatter(parseFloat(value));
  }, []);

  const legendFormatter = useCallback((value: keyof typeof legendNameMap) => {
    return legendNameMap[value];
  }, []);

  return (
    <section className={clsx("block", s.wrapper)}>
      <h3 className={s.title}>Динамика внешней торговли, млн долл.</h3>
      {hasData ? (
        <div>
          <BarChart
            width={500}
            height={300}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={YTickFormatter} />
            <Tooltip formatter={tooltipFormatter} />
            <Brush dataKey="name" height={30} stroke="#1a70ff" />
            <Legend formatter={legendFormatter} />
            <Bar dataKey="export" label="Экспорт" fill="#1555bc" />
            <Bar dataKey="import" label="Импорт" fill="#BA1928" />
          </BarChart>
        </div>
      ) : (
        "Нет данных"
      )}
      <div></div>
    </section>
  );
};

export default ImportExportGraph;
