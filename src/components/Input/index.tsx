import clsx from "clsx";
import { ChangeEventHandler, DetailedHTMLProps, Dispatch, FC, InputHTMLAttributes, SetStateAction, useCallback } from "react";
import s from './styles.module.css';

export type InputProps = {
	value: string,
	setValue: Dispatch<SetStateAction<string>>,
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'value' | 'onChange'>

const Input: FC<InputProps> = ({ value, setValue, className, ...rest }) => {

	const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		e.preventDefault();
		setValue(e.currentTarget.value);
	}, [setValue])

	return (
		<input className={clsx(s.input, className)} value={value} onChange={onChange} {...rest} />
	)
}

export default Input;