import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { lazy } from "react";

const PixelTrail = lazy(() => import("@/components/PixelTrail"));

export default function HeroSection() {
  return (
    <>
      <div style={{ height: "100vh", width: "100vw", position: "fixed", top: "0px" }}>
        <PixelTrail
          gridSize={256} // 256 x 256 pixels
          trailSize={0.1}
          maxAge={250}
          interpolate={5}
          color="#e3e3e3"
          gooeyFilter={{ id: "custom-goo-filter", strength: 1 }}
        />
      </div>
      <div className="fixed top-0 left-0 -z-10 flex h-screen min-w-full flex-col items-center justify-center rounded-md bg-neutral-900">
        <ShootingStars starWidth={30} maxDelay={3000} />
        <StarsBackground twinkleProbability={0.7} maxTwinkleSpeed={0.8} />
      </div>

      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
          Welcome to The Metaverse!
        </h1>
        <p className="max-w-2xl text-lg text-white md:text-xl">
          Connect, play, and build your digital legacy
        </p>
      </div>
    </>
  );
}
