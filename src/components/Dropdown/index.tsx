import clsx from "clsx";
import {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useClickOutside } from "../../hooks";
import s from "./styles.module.css";

export type DropdownOption = {
  value: DropdownProps["value"];
  label: string | ReactElement;
};

export type DropdownProps = {
  value: string;
  setValue: (value: DropdownProps["value"]) => void;
  options: DropdownOption[];
  fallbackValue?: DropdownOption;
  headClassName?: string;
  dropClassName?: string;
};

const Dropdown: FC<DropdownProps> = ({
  value,
  setValue,
  options,
  fallbackValue,
  headClassName,
  dropClassName,
}) => {
  const headRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleCloseDrop = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenDrop = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onHeadClick = useCallback(() => {
    const handler = isOpen ? handleCloseDrop : handleOpenDrop;
    handler();
  }, [handleCloseDrop, handleOpenDrop, isOpen]);

  useClickOutside(dropRef, handleCloseDrop, headRef);

  const handleSelect = useCallback(
    (value: DropdownOption["value"]) => () => {
      setValue(value);
    },
    [setValue]
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  return (
    <div className={s.wrapper}>
      <div className={clsx(s.head, headClassName)} ref={headRef} onClick={onHeadClick} tabIndex={0}>
        {selectedOption?.label || fallbackValue?.label}
      </div>
      <div ref={dropRef} className={clsx(s.drop, dropClassName, { [s.open]: isOpen })}>
        {options.map(({ value: optValue, label }) => (
          <div
            className={clsx(s.dropElement, {
              [s.selected]: value === optValue,
            })}
            key={optValue}
            onClick={handleSelect(optValue)}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
