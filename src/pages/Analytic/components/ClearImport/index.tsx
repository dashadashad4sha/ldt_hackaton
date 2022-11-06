import { FC, useCallback, useEffect, useState } from "react";
import { AvailableFilters } from "../../../../context";
import useStore from "../../../../store";
import s from "./styles.module.css";
import dayjs from "dayjs";

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
import { dataFormatters, numberFormatter } from "../../../../utils";
import { Loader } from "../../../../components";

type VolumeProps = {
  filters: AvailableFilters;
  code: string;
};

const legendNameMap = {
  export: "Экспорт",
  import: "Импорт",
};

type GraphData = {
  name: string;
  import: number;
};

const ClearImport: FC<VolumeProps> = ({ filters, code }) => {
  const graphData = useStore("mainDataStore");
  const [data, setData] = useState<GraphData[]>([]);
  const [flags, setFlags] = useState({ isLoading: true, isFailed: false });

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

  const fetchData = useCallback(
    async (filters: AvailableFilters, code: string) => {
      setFlags((prev) => ({ ...prev, isLoading: true }));
      let newFlags = {
        isLoading: false,
        isFailed: false,
      };
      try {
        const data = await graphData.graphDataService.getData(
          "analyticsClearImport",
          { ...filters, code }
        );
        const newData = dataFormatters
          .camelize(data)
          .map(({ date, importVolume }) => ({
            name: dayjs(date).format("DD-MM-YYYY"),
            import: parseFloat(importVolume),
          }));
        setData(newData);
      } catch (e) {
        console.error(e);
        newFlags.isFailed = true;
      }
      setFlags(newFlags);
    },
    [graphData.graphDataService]
  );

  useEffect(() => {
    fetchData(filters, code);
  }, [code, fetchData, filters]);

  if (flags.isLoading) {
    return <div className="full-loader">
		<Loader />
	</div>;
  }

  return (
    <div>
      {!flags.isFailed ? (
        <BarChart className={s.chart} width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={YTickFormatter} />
          <Tooltip formatter={tooltipFormatter} />
          <Brush dataKey="name" height={30} stroke="#1a70ff" />
          <Legend formatter={legendFormatter} />
          <Bar dataKey="import" label="Импорт" fill="#1555bc" />
        </BarChart>
      ) : (
        "Ошибка загрузки данных"
      )}
    </div>
  );
};

export default ClearImport;
