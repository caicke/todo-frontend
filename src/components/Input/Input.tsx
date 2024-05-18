import { ChangeEvent } from "react";

interface InputProps {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
    type: string;
    name: string;
    id: string;
    labelText: string;
    labelFor: string;
    isRequired: boolean;
    placeholder: string;
}

const fixedInputClass = "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"

export default function InputComponent({
    handleChange,
    value,
    type,
    name,
    id,
    labelText,
    labelFor,
    isRequired,
    placeholder
}: InputProps) {
    return (
        <div className="my-5">
            <label htmlFor={labelFor}>
                {labelText}
            </label>
            <input
                onChange={handleChange}
                value={value}
                id={id}
                name={name}
                type={type}
                required={isRequired}
                className={fixedInputClass}
                placeholder={placeholder}
            />
        </div>
    )
}