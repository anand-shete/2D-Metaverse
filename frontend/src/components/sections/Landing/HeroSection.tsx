import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { LogIn } from "lucide-react";
import { lazy } from "react";
import { useNavigate } from "react-router";

const PixelTrail = lazy(() => import("@/components/PixelTrail"));

export default function HeroSection() {
  const navigate = useNavigate();
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
        <h1 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Welcome to The Metaverse!
        </h1>
        <p className="text-center text-white md:text-xl lg:text-lg">
          Connect, play, and build your digital legacy.
        </p>
        <Button className="z-10 mt-10 text-black" size="lg" onClick={() => navigate("/login")}>
          Enter The Metaverse <LogIn className="text-neutral-800" />
        </Button>
      </div>
    </>
  );
}
