import * as React from "react";
import type { SVGProps } from "react";
const SvgUser = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 19 24"
    {...props}
  >
    <path
      stroke="#191919"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.75 22.75v-2.667c0-1.414-.478-2.77-1.328-3.77s-2.003-1.563-3.205-1.563H5.283c-1.202 0-2.355.562-3.205 1.562S.75 18.67.75 20.083v2.667m14-17.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0"
    />
  </svg>
);
export default SvgUser;
