import { cn } from "../../../lib/utils";

const KLCC = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 30 30"
    xmlSpace="preserve"
    className={cn("w-5 h-5 inline stroke-foreground fill-none", className)} // Pass className to the root svg element
  >
    <g transform="translate(-510 -80)">
      <g
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M536,108V91h-1v-5h-1v-3h-1v-3h-1v3h-1v3h-1v5h-1v6h-8v-6h-1v-5h-1v-3h-1v-3h-1v3h-1v3h-1v5h-1v17h-2v1h2h7h8h7h2v-1H536z"
          className={cn(className, "path1")}
        />
        <path
          d="M532,84h1v2h-1V84z M531,87h3v4h-3V87z M529,101.293L525.707,98H529V101.293z M524.293,98L521,101.293V98H524.293z M517,84h1v2h-1V84z M516,87h3v4h-3V87z M515,108V92h5v16H515z M521,108v-5.293l4-4l4,4V108H521z M530,108V92h5v16H530z"
          className={cn(className, "path2")}
        />
      </g>
    </g>
  </svg>
);

export default KLCC;
