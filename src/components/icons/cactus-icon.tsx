import React from 'react';

export const CactusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 8c0-2.5-1.5-5-5-5s-5 2.5-5 5v13h10V8z" />
    <path d="M5 8v13h2" />
    <path d="M17 8V3" />
    <path d="M12 21v-8" />
  </svg>
);
