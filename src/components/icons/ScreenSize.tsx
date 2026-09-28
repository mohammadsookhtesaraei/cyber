import * as React from "react";
import type { SVGProps } from "react";
const SvgScreenSize = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g clipPath="url(#Screen_size_svg__a)">
      <path
        fill="#4E4E4E"
        fillRule="evenodd"
        d="M6.608 3.25c-.843.843-.843 2.2-.843 4.913v7.674c0 2.713 0 4.07.843 4.913.842.843 2.199.843 4.912.843h.96c2.713 0 4.07 0 4.912-.843.843-.843.843-2.2.843-4.913V8.163c0-2.713 0-4.07-.843-4.913s-2.2-.843-4.912-.843h-.96c-2.713 0-4.07 0-4.912.843m7.79 2.786a.75.75 0 0 0 0-1.5H9.6a.75.75 0 0 0 0 1.5zm-2.399 12.68a1.44 1.44 0 1 0 0-2.879 1.44 1.44 0 0 0 0 2.878"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="Screen_size_svg__a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgScreenSize;
