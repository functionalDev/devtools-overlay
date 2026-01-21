import type { Component, JSX } from "solid-js";

 const base = "transition-colors border border-[#fff] dark:border-[#000] cursor-pointer rounded-[3px] disabled:cursor-not-allowed disabled:opacity-40";

  // variant styles
const variants =  {
    primary:
      "bg-blue-900 text-white hover:bg-blue-800 " +
      "dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-white",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:disabled:bg-gray-600 disabled:bg-gray-200 " +
      "dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    neutral:
      `text-gray-900 hover:brightness-120 ` +
      "dark:text-gray-100 dark:hover:brightness-120",
};


  // sizes styles
const sizes = {
    xs: "px-1 py-1 font-medium",
    s: "px-2 py-2 font-medium",
    m: "px-3 py-3 font-medium",
};

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "neutral";
  size?: "xs" | "s" | "m";
};

export const Button: Component<ButtonProps> = (props) => (
    <button 
      {...props}
      class={`${base} ${!props.disabled ? variants[props.variant || 'primary']: variants['secondary']} ${sizes[props.size || 'm']} ${props.class ?? ""}`}
    />
)