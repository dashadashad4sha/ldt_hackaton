import { FC, useCallback } from 'react';

import cn from 'clsx';

import { ReactElement } from 'react';
import './styles.css';

export type TOption = {
  value: string;
  content: string | ReactElement;
  disabled?: boolean;
};

export interface OptionSelectorProps {
  name: string;
  options: TOption[];
  selected: TOption;
  setSelected: (val: TOption) => void;
  className?: string;
  dir?: 'vertical' | 'horizontal';
}

type OptionProps = TOption & {
  name: string;
  tabIndex: number;
  selected: boolean;
  onClick: (val: TOption) => void;
};

const Option: FC<OptionProps> = ({
  name,
  value,
  tabIndex,
  content,
  disabled,
  selected,
  onClick,
}) => (
  <label htmlFor={`option-${name}-${value}`} className={cn('single-option', { disabled })}>
    <input
      type="radio"
      id={`option-${name}-${value}`}
      name={name}
      checked={selected}
      onChange={() => onClick({ value, content })}
      className="single-option-input"
      disabled={disabled}
      tabIndex={tabIndex}
    />
    <span className="single-option-radio" />
    <div>{content}</div>
  </label>
);

/**
 * @param {string} name - the unique name of the selector
 * @param {TOption[]} options - the list of options which will be displayed
 * @param {TOption} selected - selected element
 * @param {(val: TOption) => void} setSelected  - the callback function which takes as argument `TOption` value
 * @param {string} [className] - the wrapper class name
 * @param {('vertical' | 'horizontal')} [dir] - the direction of the options `initial = vertical`
 * * vertical
 * * horizontal
 */
const OptionSelector: FC<OptionSelectorProps> = ({
  name,
  options,
  selected,
  setSelected,
  className,
  dir = 'vertical',
}) => {
  const onOptionClick = useCallback((val: TOption) => () => setSelected(val), [setSelected]);

  return (
    <section className={cn(dir, 'option-selector', className)}>
      {options.map((opt, idx) => (
        <Option
          tabIndex={idx}
          key={opt.value}
          {...opt}
          name={name}
          selected={selected.value === opt.value}
          onClick={onOptionClick(opt)}
        />
      ))}
    </section>
  );
};

export default OptionSelector;