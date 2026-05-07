import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { ArrowRight, LogIn } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="fixed inset-0 -z-10 flex min-w-full bg-black/90">
        <ShootingStars starWidth={30} maxDelay={3000} />
        <StarsBackground twinkleProbability={0.7} maxTwinkleSpeed={0.8} />
      </div>
      <div className="mx-auto flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-5xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
        >
          Welcome to the Metaverse!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-8 max-w-3xl text-lg leading-8 text-slate-300"
        >
          A shared virtual campus for students to connect, collaborate and interact in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="group h-12 rounded-xl text-base font-semibold text-black shadow-lg transition-all hover:scale-105"
          >
            Create Avatar
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/metaverse")}
            className="h-12 rounded-xl border border-white/10 bg-white/5 px-7 text-base text-white backdrop-blur hover:bg-white/10"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Join World
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
