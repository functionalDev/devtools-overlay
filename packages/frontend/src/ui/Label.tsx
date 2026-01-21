import type { Component, JSX } from "solid-js";

 const base = `
  text-[clamp(12px,1.5vw,16px)]
  rounded-[5px]
  place-self-center
  p-[5px_3vw]
  border
  border-solid
  border-[rgba(from_currentColor_r_g_b_/_0.2)]
`;



//   // sizes styles
// const sizes = {
//     xs: "px-1 py-1 font-medium",
//     s: "px-2 py-2 font-medium",
//     m: "px-3 py-3 font-medium",
// };

export type LabelProps = JSX.HTMLAttributes<HTMLLabelElement> & {
  variant?: "primary" | "secondary" | "neutral";
  size?: "xs" | "s" | "m";
};

export const Label: Component<LabelProps> = (props) => (
    <label 
      {...props}
      class={`${base} ${props.class ?? ""}`}
    />
)