import React from "react";
import { cn } from "@/lib/utils";

interface PixelAvatarProps {
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({
  color,
  size = "md",
  className,
  animated = false,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "relative pixel-border",
        sizeClasses[size],
        animated && "animate-float",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}80)`,
          boxShadow: `0 0 15px ${color}40`,
        }}
      />
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
        {/* Eyes */}
        <div className="col-start-2 row-start-2 bg-black w-1/2 h-1/2 place-self-center rounded-[1px]"></div>
        <div className="col-start-3 row-start-2 bg-black w-1/2 h-1/2 place-self-center rounded-[1px]"></div>

        {/* Mouth */}
        <div className="col-start-2 col-span-2 row-start-3 bg-black w-full h-1/3 place-self-center rounded-[1px]"></div>
      </div>
    </div>
  );
};

export default PixelAvatar;
