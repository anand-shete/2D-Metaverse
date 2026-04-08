import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed top-0 left-0 -z-1 flex h-screen min-w-full flex-col items-center justify-center rounded-md bg-neutral-900">
        <ShootingStars starWidth={30} maxDelay={3000} />
        <StarsBackground twinkleProbability={0.7} maxTwinkleSpeed={0.8} />
      </div>

      <div className="flex h-screen flex-col items-center justify-center text-white">
        <h1 className="mb-5 text-center text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Welcome to the Metaverse!
        </h1>
        <p className="text-center text-neutral-300 md:text-xl lg:text-2xl">
          Connect, play, and build your digital legacy.
        </p>
        <Button
          className="z-1 mt-10 font-semibold text-black hover:scale-110 hover:shadow-2xl"
          size="lg"
          onClick={() => navigate("/signup")}
        >
          Create Avatar
          <LogIn className="text-neutral-800" />
        </Button>
      </div>
    </>
  );
}
