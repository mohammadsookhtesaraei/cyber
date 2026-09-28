import * as React from "react";
import type { SVGProps } from "react";
const SvgEditMini = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#222"
      strokeLinecap="round"
      strokeWidth={1.2}
      d="M12 8v8M16 12H8"
    />
  </svg>
);
export default SvgEditMini;
