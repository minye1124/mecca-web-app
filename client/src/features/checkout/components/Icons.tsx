import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6.5L8 10.5L12 6.5" />
    </svg>
  );
}
