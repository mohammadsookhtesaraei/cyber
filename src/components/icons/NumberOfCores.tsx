import * as React from "react";
import type { SVGProps } from "react";
const SvgNumberOfCores = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#4E4E4E"
      d="M7 11c0-1.886 0-2.828.586-3.414S9.114 7 11 7h2c1.886 0 2.828 0 3.414.586S17 9.114 17 11v2c0 1.886 0 2.828-.586 3.414S14.886 17 13 17h-2c-1.886 0-2.828 0-3.414-.586S7 14.886 7 13z"
    />
    <path
      fill="#4E4E4E"
      d="M13 10h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
    />
    <path
      stroke="#4E4E4E"
      strokeLinecap="round"
      d="M10 7V4M14 7V4M17 10h3M17 14h3M10 20v-3M14 20v-3M4 10h3M4 14h3"
    />
  </svg>
);
export default SvgNumberOfCores;
