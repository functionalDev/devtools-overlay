import type { Component, JSX } from "solid-js";

 const base = `
  transition-colors 
  border 
  border-solid 
  border-[#777] 
  dark:border-[#777] 
  rounded-[3px] 
  hover:border-[#555] 
  dark:hover:border-[#aaa]
  focus-visible:outline-none
  focus-visible:ring-1 focus-visible:ring-white
`;


  // sizes styles
const sizes = {
    s: "px-1 py-1 font-medium",
    m: "px-1 py-1 font-medium",
};

  type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "primary" | "secondary" | "neutral";
  size?: "s" | "m";
};

export const Input: Component<InputProps> = (props) => (
    <input 
      {...props}
      class={`${base} ${sizes[props.size || 'm']} ${props.class ?? ""}`}
    />
)