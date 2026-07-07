import { SectorsLogo } from "./Icons";

const MadeBySupertype = () => {
  return (
    <div className="flex gap-2 items-center group justify-center">
      <SectorsLogo size={18} />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] text-muted-foreground">
          Handcrafted by
        </span>
        <span className="font-bold text-[11px] group-hover:text-spectral1 transition-all ease-in-out duration-500">
          Supertype
        </span>
      </div>
    </div>
  );
};

export default MadeBySupertype;
