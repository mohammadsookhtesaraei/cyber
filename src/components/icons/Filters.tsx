import * as React from "react";
import type { SVGProps } from "react";
const SvgFilters = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      d="M4 5h6m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m0 0h6M4 12h12m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm-8 7h12M8 19a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
    />
  </svg>
);
export default SvgFilters;
