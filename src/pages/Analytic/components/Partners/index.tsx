import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { AvailableFilters } from "../../../../context";
import useStore from "../../../../store";
import s from "./styles.module.css";

import { PieChart, Pie, Cell, Sector } from "recharts";
import {
  dataFormatters,
  numberFormatter,
  shadeGenerator,
} from "../../../../utils";
import { AnalyticsTradePartners } from "../../../../services/graphData";
import { Loader, OptionSelector } from "../../../../components";
import { OptionSelectorProps } from "../../../../components/Options";

type VolumeProps = {
  filters: AvailableFilters;
  code: string;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={20} dy={8} textAnchor="middle" fill="#000">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Оборот: ${numberFormatter(value)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

type Options = keyof AnalyticsTradePartners;

const options: { content: string; value: Options }[] = [
  { content: "Общий объем", value: "tradeVolume" },
  { content: "Экспорт", value: "exportVolume" },
  { content: "Импорт", value: "importVolume" },
];

const Partners: FC<VolumeProps> = ({ filters, code }) => {
  const graphData = useStore("mainDataStore");
  const [data, setData] = useState<AnalyticsTradePartners[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<Options>("tradeVolume");
  const [flags, setFlags] = useState({ isLoading: true, isFailed: false });
  const [activeShape, setActiveShape] = useState(0);

  const shades = useMemo(() => {
    const shadesCount = Math.ceil(data.length / 3);
    return [
      ...shadeGenerator("#1a70ff", shadesCount),
      ...shadeGenerator("#ba1928", shadesCount),
      ...shadeGenerator("#FED766", shadesCount),
    ];
  }, [data.length]);

  const onMouseEnter = useCallback((_: any, idx: number) => {
    setActiveShape(idx);
  }, []);

  const fetchData = useCallback(
    async (filters: AvailableFilters) => {
      setFlags((prev) => ({ ...prev, isLoading: true }));
      let newFlags = {
        isLoading: false,
        isFailed: false,
      };
      try {
        const data = await graphData.graphDataService.getData(
          "analyticsTradePartners",
          { ...filters, code }
        );
        const newData = dataFormatters.camelize(data);
        setData(newData);
      } catch (e) {
        newFlags.isFailed = true;
      }
      setFlags(newFlags);
    },
    [code, graphData.graphDataService]
  );

  useEffect(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  const dataForGraph = useMemo(
    () =>
      data.map((obj) => ({
        name: obj.country,
        value: parseFloat(obj[selectedInfo]) || 0,
      })),
    [data, selectedInfo]
  );

  const selectedOptions = useMemo(
    () =>
      options.find(({ value }) => value === selectedInfo) || {
        value: "",
        content: "",
      },
    [selectedInfo]
  );

  const setOptions: OptionSelectorProps["setSelected"] = useCallback((opt) => {
    setSelectedInfo(opt.value as any);
  }, []);

  if (flags.isLoading) {
    return <div className="full-loader">
		<Loader />
	</div>;
  }

  return (
    <div>
      {!flags.isFailed ? (
        <div>
          {dataForGraph.length !== 0 ? (
            <>
              <OptionSelector
                className={s.selector}
                setSelected={setOptions}
                name="options"
                selected={selectedOptions}
                options={options}
              />
              <PieChart width={500} height={300}>
                <Pie
                  data={dataForGraph}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  activeIndex={activeShape}
                  activeShape={renderActiveShape}
                  onMouseEnter={onMouseEnter}
                >
                  {dataForGraph.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={shades[index]} />
                  ))}
                </Pie>
              </PieChart>
            </>
          ) : (
            "Нет данных"
          )}
        </div>
      ) : (
        "Ошибка загрузки данных"
      )}
    </div>
  );
};

export default Partners;
