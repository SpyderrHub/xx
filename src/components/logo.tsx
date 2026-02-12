
import * as React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="140"
    height="28"
    viewBox="0 0 140 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text
      x="0"
      y="22"
      className="fill-foreground font-bold"
      style={{ fontSize: '20px', fontFamily: 'Inter, sans-serif' }}
    >
      Saanchi
      <tspan className="fill-primary"> AI</tspan>
    </text>
  </svg>
);

export default Logo;
