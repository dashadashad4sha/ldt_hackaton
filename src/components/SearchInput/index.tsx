import clsx from "clsx";
import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import { CrossIcon } from "../../assets";
import Input, { InputProps } from "../Input";
import Loader from "../Loader";
import s from "./styles.module.css";

export type SearchInputProps = {
  isLoading?: boolean;
  isTouched?: boolean;
  suggestions?: ReactElement[];
  onSearchClick: (val: InputProps["value"]) => void;
} & InputProps;

const SearchInput: FC<SearchInputProps> = ({
  value,
  onSearchClick,
  setValue,
  suggestions = [],
  isLoading = false,
  isTouched = true,
  ...rest
}) => {
  const hasResults = useMemo(
    () => suggestions.length !== 0,
    [suggestions.length]
  );

  const hasPreSearch = useMemo(() => value !== "", [value]);

  const handleSearch = useCallback(() => {
    onSearchClick(value);
  }, [onSearchClick, value]);

  const handleClear = useCallback(() => {
    setValue("");
  }, [setValue]);

  const shouldRenderSuggestions = useMemo(
    () => value !== "" && isTouched,
    [isTouched, value]
  );

  return (
    <div className={s.wrapper}>
      <Input className={s.input} value={value} setValue={setValue} {...rest} />
      <button
        onClick={handleClear}
        disabled={!hasPreSearch}
        className={clsx("icon-button", s.clearButton, {
          [s.show]: hasPreSearch,
        })}
      >
        <CrossIcon />
      </button>
      <button onClick={handleSearch} className={clsx(s.button)}>
        Найти
      </button>
      {shouldRenderSuggestions && (
        <div className={clsx("block", s.suggestions)}>
          {isLoading ? (
            <div className={s.loader}>
              <Loader />
            </div>
          ) : hasResults ? (
            suggestions
          ) : (
            "Нет результатов"
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
