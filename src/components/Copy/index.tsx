import { FC, MouseEventHandler, PropsWithChildren, useCallback } from "react";
import { CopyIcon } from "../../assets";
import copy from 'copy-to-clipboard';
import s from './styles.module.css';

export type CopyProps = {
  value: string | number | boolean;
  withIcon?: boolean;
};

const Copy: FC<PropsWithChildren<CopyProps>> = ({
  value,
  children,
  withIcon = true,
}) => {
	const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
		e.preventDefault();
		copy(value.toString());
		e.stopPropagation();
	}, [value])
  return (
    <div onClick={onClick} className={s.wrapper} tabIndex={0}>
      <div className={s.content}>{children}</div>
      {withIcon && (
        <div className={s.icon}>
          <CopyIcon />
        </div>
      )}
    </div>
  );
};

export default Copy;
