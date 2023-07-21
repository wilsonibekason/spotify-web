import React, { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ children, name, className, type, disabled, ...props }, ref) => {
    return (
      <input
        className={twMerge("", className)}
        disabled={disabled}
        type={type}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
