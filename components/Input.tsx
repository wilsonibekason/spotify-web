import React, { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ children, name, className, type, disabled, ...props }, ref) => {
    return (
      <input
        className={twMerge("flex w-full rounded-md bg-neutral-700 border border-transparent px-3 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-mediun placeholder:text-neutral-400 disabled:cursor-no-allowed disabled:opacity-50 focus:outline-none", className)}
        disabled={disabled}
        type={type}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
