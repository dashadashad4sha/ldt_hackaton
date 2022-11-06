import { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import CountryDomain from "../../../../domain/country";
import Dropdown from "../../../../components/Dropdown";

type VolumeProps = {
  filters: AvailableFilters;
  code: string;
  country: string;
  setCountry: (country: VolumeProps["country"]) => void;
  countries: CountryDomain[];
};

const legendNameMap = {
  export: "Экспорт",
  import: "Импорт",
};

type GraphData = {
  name: string;
  export: number;
  import: number;
};

const fallback = {
  value: "",
  label: "Страна",
};

const Volume: FC<VolumeProps> = ({
  filters,
  code,
  country,
  setCountry,
  countries,
}) => {
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
          "analyticsImportExport",
          { ...filters, code }
        );
        const newData = dataFormatters
          .camelize(data)
          .map(({ date, exportValue, importValue }) => ({
            name: dayjs(date).format("DD-MM-YYYY"),
            export: parseFloat(exportValue),
            import: parseFloat(importValue),
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

  useEffect(() => () => setCountry(""), []);

  const countryOptions = useMemo(
    () =>
      countries.map(({ id, name }) => ({ value: id.toString(), label: name })),
    [countries]
  );

  if (flags.isLoading) {
    return (
      <div className="full-loader">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!flags.isFailed ? (
        <div className={s.wrapper}>
          <div className={s.filter}>
            <h3>Фильтр:</h3>
            <Dropdown
              value={country}
              fallbackValue={fallback}
              setValue={setCountry}
              options={countryOptions}
            />
          </div>
          <BarChart className={s.chart} width={500} height={300} data={data}>
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
        "Ошибка загрузки данных"
      )}
    </>
  );
};

export default Volume;
