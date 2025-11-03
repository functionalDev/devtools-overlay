import type { Component, JSX } from "solid-js";

 const base = "transition-colors border border-[#fff] dark:border-[#000] cursor-pointer rounded-[3px]";

  // variant styles
const variants = {
    primary:
      "bg-blue-900 text-white hover:bg-blue-800 " +
      "dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-white",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 " +
      "dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
};


  // sizes styles
const sizes = {
    xs: "px-1 py-1 font-medium",
    s: "px-2 py-2 font-medium",
    m: "px-3 py-3 font-medium",
};

  type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "xs" | "s" | "m";
};

export const Button: Component<ButtonProps> = (props) => {
    return (
        <button 
            class={`${base} ${variants[props.variant || 'primary']} ${sizes[props.size || 'm']} ${props.class ?? ""}`}
            {...props}
        />
    )
} 