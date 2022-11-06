import { observer } from "mobx-react-lite";
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import filters from "../../config/filters";
import useStore from "../../store";

type Filters = {
  region: string;
  startDate: DateString;
  endDate: DateString;
  country: string;
  setRegion: (value: Filters["region"]) => void;
  setStartDate: (value: Filters["startDate"]) => void;
  setEndDate: (value: Filters["endDate"]) => void;
  setCountry: (value: Filters["country"]) => void;
};

export type AvailableFilters = Pick<Filters, 'region' | 'startDate' | 'endDate' | 'country'>

const FiltersContext = createContext({} as Filters);

const FilterProvider: FC<PropsWithChildren> = observer(({ children }) => {
  const { defaultRegion } = useStore("federalDistrictsStore");
  const [region, setRegion] = useState(defaultRegion?.name || "");
  const [startDate, setStartDate] = useState(filters.date.min);
  const [endDate, setEndDate] = useState(filters.date.max);
  const [country, setCountry] = useState<string>("");

  const values = useMemo(
    () => ({
      region,
      setRegion,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      country,
      setCountry,
    }),
    [country, endDate, region, startDate]
  );

  useEffect(() => {
	setRegion(defaultRegion?.name || '');
  }, [defaultRegion?.id, defaultRegion?.name])

  return (
    <FiltersContext.Provider value={values}>{children}</FiltersContext.Provider>
  );
});

export const useFilters = () => useContext(FiltersContext);
export default FilterProvider;