import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Navigation, Pagination } from "swiper";
import Dropdown, { DropdownOption } from "../../../../components/Dropdown";
import RegionDomain from "../../../../domain/region";
import useStore from "../../../../store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Loader, RecommendationCard } from "../../../../components";
import clsx from "clsx";
import s from "./styles.module.css";
import { observer } from "mobx-react-lite";

const formatRegionToDropDown = (region: RegionDomain): DropdownOption => ({
  value: region.name,
  label: region.name,
});

const initialValue: DropdownOption = { value: "", label: "Выберите регион" };

const RecommendedSection: FC = observer(() => {
  const federalDistrictsStore = useStore("federalDistrictsStore");
  const recommendations = useStore("recommendationsStore");
  const [selectedRegion, setSelectedRegion] = useState(
    federalDistrictsStore.defaultRegion
      ? formatRegionToDropDown(federalDistrictsStore.defaultRegion).value
      : initialValue.value
  );

  useEffect(() => {
    if (federalDistrictsStore.defaultRegion) {
      setSelectedRegion(
        formatRegionToDropDown(federalDistrictsStore.defaultRegion).value
      );
    }
  }, [federalDistrictsStore.defaultRegion]);

  const mappedRegions = useMemo(
    () =>
      federalDistrictsStore.regions.map((region) =>
        formatRegionToDropDown(region)
      ),
    [federalDistrictsStore.regions]
  );

  const hasRecommendations = useMemo(
    () => recommendations.recommendations.length !== 0,
    [recommendations.recommendations.length]
  );

  const handleChangeRegion = useCallback((value: typeof selectedRegion) => {
    setSelectedRegion(value);
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      recommendations.getTopRecommendations({ region: selectedRegion });
    }
  }, [recommendations, selectedRegion]);

  return (
    <div className={clsx("container")}>
      <section className={s.recommendationTitle}>
        <h1 className={s.title}>Рекомендованные ниши</h1>
        <Dropdown
          value={selectedRegion}
          setValue={handleChangeRegion}
          options={mappedRegions}
          fallbackValue={initialValue}
          headClassName={s.dropHead}
          dropClassName={"block"}
        />
      </section>
      {recommendations.flags.isLoading ? (
        <div className={"full-loader"}><Loader /></div>
      ) : (
        <section className={clsx(s.recommendationSlider)}>
          {hasRecommendations ? (
            <Swiper
              className={s.slider}
              spaceBetween={50}
              slidesPerView={4}
              modules={[Navigation, Pagination]}
              pagination={{ clickable: true }}
              loop
            >
              {recommendations.recommendations.map((recommendation, key) => (
                <SwiperSlide key={recommendation.tnvedCode}>
                  <RecommendationCard place={key + 1} {...recommendation} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <h3>По данному региону нет рекоменадций</h3>
          )}
        </section>
      )}
    </div>
  );
});

export default RecommendedSection;
