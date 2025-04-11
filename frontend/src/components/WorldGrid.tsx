import { useState, useEffect } from "react";
import PixelAvatar from "./PixelAvatar";
import { cn } from "@/lib/utils";

interface GridPosition {
  x: number;
  y: number;
  color: string;
  size: "md" | "lg";
}

const WorldGrid = () => {
  const [positions, setPositions] = useState<GridPosition[]>([]);
  const gridSize = { width: 10, height: 6 };

  useEffect(() => {
    // Generate random positions for avatars
    const generatePositions = () => {
      const colors = ["#8B5CF6", "#0EA5E9", "#D946EF", "#10B981", "#F59E0B"];
      const newPositions: GridPosition[] = [];

      // Generate 5-8 random avatars
      const count = Math.floor(Math.random() * 4) + 5;

      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * gridSize.width);
        const y = Math.floor(Math.random() * gridSize.height);

        // Check if position is already taken
        const exists = newPositions.some((pos) => pos.x === x && pos.y === y);
        if (!exists) {
          newPositions.push({
            x,
            y,
            color: colors[i % colors.length],
            size: Math.random() > 0.7 ? "lg" : "md",
          });
        }
      }

      return newPositions;
    };

    setPositions(generatePositions());

    // Update positions every 5 seconds
    const interval = setInterval(() => {
      setPositions(generatePositions());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-lg  bg-[#1a1f2c]/70 backdrop-blur-sm p-4">
      <div className="w-full aspect-[5/3] rounded-md relative">
        {positions.map((pos, index) => (
          <div
            key={index}
            className="absolute transition-all duration-700 ease-in-out"
            style={{
              left: `${(pos.x / gridSize.width) * 100}%`,
              top: `${(pos.y / gridSize.height) * 100}%`,
            }}
          >
            <PixelAvatar
              color={pos.color}
              size={pos.size}
              animated={true}
              className={cn(
                "transform -translate-x-1/2 -translate-y-1/2",
                pos.size === "lg" ? "z-20" : "z-10"
              )}
            />
          </div>
        ))}

        {/* Grid markers */}
        {Array.from({ length: gridSize.width }).map((_, i) => (
          <div
            key={`col-${i}`}
            className="absolute bottom-0 w-px h-2 bg-metaverse-purple/40"
            style={{ left: `${(i / gridSize.width) * 100}%` }}
          />
        ))}

        {Array.from({ length: gridSize.height }).map((_, i) => (
          <div
            key={`row-${i}`}
            className="absolute right-0 h-px w-2 bg-metaverse-purple/40"
            style={{ top: `${(i / gridSize.height) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-center text-metaverse-purple">
        Interactive Metaverse View •{" "}
        <span className="text-metaverse-blue">
          User Count: {positions.length}
        </span>
      </div>
    </div>
  );
};

export default WorldGrid;
