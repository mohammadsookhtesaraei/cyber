import * as React from "react";
import type { SVGProps } from "react";
const SvgBurger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <path
      fill="#080341"
      fillRule="evenodd"
      d="M32.5 13.75h-25v-2.5h25zM32.5 21.25h-25v-2.5h25zM32.5 28.75h-25v-2.5h25z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgBurger;
