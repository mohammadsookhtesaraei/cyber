import * as React from "react";
import type { SVGProps } from "react";
const SvgInstagram = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#Instagram_svg__a)">
      <path
        fill="#fff"
        stroke="#fff"
        strokeWidth={2}
        d="M8 14.667c-1.43 0-2.458-.001-3.26-.079-.793-.077-1.3-.224-1.705-.479a3.6 3.6 0 0 1-1.144-1.144c-.255-.405-.402-.912-.48-1.705-.077-.802-.078-1.83-.078-3.26s.001-2.458.079-3.26c.077-.793.224-1.3.479-1.705.29-.463.681-.854 1.144-1.144.405-.255.912-.402 1.705-.48.802-.077 1.83-.078 3.26-.078s2.458.001 3.26.079c.793.077 1.3.224 1.705.479.463.29.854.681 1.144 1.144.255.405.402.912.48 1.705.077.802.078 1.83.078 3.26s-.001 2.458-.079 3.26c-.077.793-.224 1.3-.479 1.705-.29.463-.681.854-1.144 1.144-.405.255-.912.402-1.705.48-.802.077-1.83.078-3.26.078Z"
      />
      <path
        fill="#fff"
        stroke="#000"
        strokeWidth={2}
        d="M8 11.333A2.667 2.667 0 1 0 8 6a2.667 2.667 0 0 0 0 5.333Z"
      />
      <path fill="#000" d="M11.25 5.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" />
    </g>
    <defs>
      <clipPath id="Instagram_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgInstagram;
