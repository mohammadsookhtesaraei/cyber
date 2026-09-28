import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#191919"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m18 9-6 6-6-6"
    />
  </svg>
);
export default SvgArrowDown;
