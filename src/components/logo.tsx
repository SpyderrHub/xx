import * as React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="101"
    height="28"
    viewBox="0 0 101 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21.05 23.36V4.64H26.33V23.36H21.05Z"
      className="fill-foreground"
    />
    <path
      d="M10.51 24L0 4.64H5.6L10.51 15.68L15.42 4.64H21.02L10.51 24Z"
      className="fill-primary"
    />
    <path
      d="M40.1651 4.64C35.8151 4.64 32.3151 8.08 32.3151 14C32.3151 19.92 35.8151 23.36 40.1651 23.36C44.5151 23.36 48.0151 19.92 48.0151 14C48.0151 8.08 44.5151 4.64 40.1651 4.64ZM40.1651 19.44C38.0951 19.44 36.4351 17.06 36.4351 14C36.4351 10.94 38.0951 8.56 40.1651 8.56C42.2351 8.56 43.8951 10.94 43.8951 14C43.8951 17.06 42.2351 19.44 40.1651 19.44Z"
      className="fill-foreground"
    />
    <path
      d="M60.6757 23.36L52.5457 14L60.6757 4.64H66.0157L57.8857 14L66.0157 23.36H60.6757Z"
      className="fill-foreground"
    />
    <path
      d="M78.6917 23.36H72.8117V4.64H78.6917V23.36Z"
      className="fill-primary"
    />
    <path
      d="M84.5717 19.44V8.56H91.1817V4.64H80.4517V23.36H91.5417V19.44H84.5717Z"
      className="fill-foreground"
    />
    <path
      d="M96.7817 4.64V23.36H100.902V4.64H96.7817Z"
      className="fill-foreground"
    />
  </svg>
);

export default Logo;
