import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetaverseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  className?: string;
}

const MetaverseCard: React.FC<MetaverseCardProps> = ({
  title,
  description,
  icon,
  color = "from-metaverse-purple to-metaverse-blue",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-300",
        "hover:scale-105 hover:shadow-lg",
        "border border-white/10 backdrop-blur-md",
        "bg-gradient-to-br from-white/5 to-white/10",
        className
      )}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20`}
        ></div>
      </div>

      <div className="relative z-10 p-6">
        <div
          className={`inline-flex rounded-full p-3 bg-gradient-to-br ${color}`}
        >
          {icon}
        </div>

        <h3 className="mt-4 text-lg font-medium text-white">{title}</h3>

        <p className="mt-2 text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default MetaverseCard;
