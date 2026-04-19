import * as React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="180"
    height="36"
    viewBox="0 0 180 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Stylized QUANTOSAI Logo */}
    <g fill="currentColor">
      {/* Q */}
      <circle cx="12" cy="18" r="8" stroke="#FF6600" strokeWidth="2.5" fill="none" />
      <path d="M18 24L22 28" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* U */}
      <path d="M28 12V22C28 24.2091 29.7909 26 32 26V26C34.2091 26 36 24.2091 36 22V12" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* A */}
      <path d="M44 26L50 12L56 26" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M47 20H53" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* N */}
      <path d="M64 26V12L74 26V12" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* T */}
      <path d="M86 12V26" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M80 12H92" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* O - Speech Bubble */}
      <path d="M100 12H112C114.209 12 116 13.7909 116 16V22C116 24.2091 114.209 26 112 26H104L100 30V26C97.7909 26 96 24.2091 96 22V16C96 13.7909 97.7909 12 100 12Z" fill="#FF6600" />
      <circle cx="101" cy="19" r="1" fill="#0B0B0F" />
      <circle cx="106" cy="19" r="1" fill="#0B0B0F" />
      <circle cx="111" cy="19" r="1" fill="#0B0B0F" />

      {/* S */}
      <path d="M124 26C128 26 132 24 132 21C132 18 124 18 124 15C124 12 128 10 132 10" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* A */}
      <path d="M140 26L146 12L152 26" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M143 20H149" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* i */}
      <path d="M162 18V26" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="162" cy="13" r="2.5" fill="#FF6600" />
    </g>
  </svg>
);

export default Logo;