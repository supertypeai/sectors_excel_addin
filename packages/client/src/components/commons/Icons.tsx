import {
  Link,
  ArrowUpRight,
  ArrowRight,
  PackageCheck,
} from "lucide-react";

const Icons = {
  Link,
  ArrowUpRight,
  ArrowRight,
  PackageCheck,
};

export { Icons };

const SectorsLogo = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1080 1080"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="213.6" y="299.6" width="653.7" height="190.7" fill="url(#sectors-grad-bar)" opacity="0.75" />
    <polygon points="867.3,204.3 213.8,303.1 213.8,112.5 867.3,13.6" fill="url(#sectors-grad-top)" />
    <polygon points="867.2,680.9 213.7,779.8 213.7,589.1 867.2,490.3" fill="url(#sectors-grad-bot)" />
    <path d="M231.8,517.5h-9.1c-5,0-9.1-4.1-9.1-9.1V90.8c0-5,4.1-9.1,9.1-9.1h9.1c5,0,9.1,4.1,9.1,9.1v417.6C240.9,513.4,236.8,517.5,231.8,517.5z" fill="#E0003B" />
    <path d="M858.2,708.1h-9.1c-5,0-9.1-4.1-9.1-9.1V281.4c0-5,4.1-9.1,9.1-9.1h9.1c5,0,9.1,4.1,9.1,9.1v417.6C867.3,704.1,863.2,708.1,858.2,708.1z" fill="#F76400" />
    <path d="M231.8,789.8h-9.1c-5,0-9.1-4.1-9.1-9.1V581c0-5,4.1-9.1,9.1-9.1h9.1c5,0,9.1,4.1,9.1,9.1v199.7C240.9,785.8,236.8,789.8,231.8,789.8z" fill="#F76400" />
    <path d="M858.2,217.9h-9.1c-5,0-9.1-4.1-9.1-9.1V9.1c0-5,4.1-9.1,9.1-9.1h9.1c5,0,9.1,4.1,9.1,9.1v199.7C867.3,213.8,863.2,217.9,858.2,217.9z" fill="#E0003B" />
    <defs>
      <linearGradient id="sectors-grad-bar" x1="213.6" y1="394.9" x2="867.3" y2="394.9" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#E11D48" />
        <stop offset="0.2463" stopColor="#E62D3E" />
        <stop offset="0.7285" stopColor="#F25826" />
        <stop offset="1" stopColor="#F97316" />
      </linearGradient>
      <linearGradient id="sectors-grad-top" x1="213.8" y1="158.4" x2="867.3" y2="158.4" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#E11D48" stopOpacity="0.7" />
        <stop offset="1" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="sectors-grad-bot" x1="213.7" y1="635" x2="867.2" y2="635" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#F97316" />
        <stop offset="1" stopColor="#F97316" stopOpacity="0.7" />
      </linearGradient>
    </defs>
  </svg>
);

export { SectorsLogo };
