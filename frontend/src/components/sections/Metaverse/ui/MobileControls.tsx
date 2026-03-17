import {
  SquareChevronDown,
  SquareChevronLeft,
  SquareChevronRight,
  SquareChevronUp,
} from "lucide-react";

interface Props {
  onKeyChange: (key: "w" | "a" | "s" | "d", pressed: boolean) => void;
}

const MobileControls = ({ onKeyChange }: Props) => {
  const bind = (key: "w" | "a" | "s" | "d") => ({
    onPointerDown: () => onKeyChange(key, true),
    onPointerUp: () => onKeyChange(key, false),
    onPointerLeave: () => onKeyChange(key, false),
    onPointerCancel: () => onKeyChange(key, false),
  });

  return (
    <div className="relative bottom-[30vh] z-10 *:absolute *:rounded-sm *:bg-slate-600/60 *:p-1 *:transition-colors *:hover:bg-slate-500 *:active:bg-slate-700 md:hidden">
      <button {...bind("w")} aria-label="Move up" className="bottom-2 left-11">
        <SquareChevronUp size={24} />
      </button>
      <button {...bind("a")} aria-label="Move left" className="left-2">
        <SquareChevronLeft size={24} />
      </button>
      <button {...bind("d")} aria-label="Move right" className="left-20">
        <SquareChevronRight size={24} />
      </button>
      <button {...bind("s")} aria-label="Move down" className="top-10 left-11">
        <SquareChevronDown size={24} />
      </button>
    </div>
  );
};

export default MobileControls;
