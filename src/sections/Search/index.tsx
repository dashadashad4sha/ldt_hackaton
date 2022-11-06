import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SearchInput, SearchInputProps } from "../../components";
import useStore from "../../store";
import { SuggestionElement } from "./components";
import s from "./styles.module.css";

const Search: FC = observer(() => {
  const searchStore = useStore("searchStore");

  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useMemo(
    () => debounce(searchStore.getSuggestions.bind(searchStore), 400),
    [searchStore]
  );

  const handleSearch: SearchInputProps["onSearchClick"] = useCallback(
    async (value) => {
      await debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleClearInput = useCallback(() => {
	setSearchValue('');
  }, [])

  useEffect(() => {
    handleSearch(searchValue);
  }, [handleSearch, searchValue]);

  const mappedSuggestions = useMemo(
    () =>
      searchStore.suggestions.map((suggestions) => (
        <SuggestionElement onClick={handleClearInput} key={suggestions.tnvedCode} {...suggestions} />
      )),
    [handleClearInput, searchStore.suggestions]
  );

  return (
    <div className={s.wrapper}>
      <SearchInput
        onSearchClick={handleSearch}
        value={searchValue}
        setValue={setSearchValue}
        suggestions={mappedSuggestions}
        isLoading={searchStore.flags.isSearching}
		isTouched={searchStore.flags.isTouched} 
		placeholder="Найдется все"
      />
    </div>
  );
});

export default Search;
