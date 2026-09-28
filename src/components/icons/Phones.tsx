import * as React from "react";
import type { SVGProps } from "react";
const SvgPhones = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#2E2E2E"
      d="M11 2a1 1 0 1 0 0 2zm2.344 2a1 1 0 0 0 0-2zM13 18.86a1 1 0 1 0-2 0zm-2 .01a1 1 0 1 0 2 0zM7.313 3.625h9.375v-2H7.313zm9.375 0c.094 0 .171.077.171.172h2c0-1.2-.972-2.172-2.172-2.172zm.171.172v16.406h2V3.797zm0 16.406a.17.17 0 0 1-.172.172v2c1.2 0 2.172-.972 2.172-2.172zm-.172.172H7.313v2h9.375zm-9.375 0a.17.17 0 0 1-.171-.172h-2c0 1.2.972 2.172 2.172 2.172zm-.171-.172V3.797h-2v16.406zm0-16.406c0-.095.077-.172.172-.172v-2c-1.2 0-2.172.972-2.172 2.172zM11 4h2.344V2H11zm0 14.86v.01h2v-.01zM6.5 17.5h11v-2h-11z"
    />
  </svg>
);
export default SvgPhones;
