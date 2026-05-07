import { Link } from "react-router";
import { LogIn, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="relative overflow-hidden border-t border-slate-400 py-32 text-white">
    <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
      <h2 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
        Step into a shared virtual campus built for collaboration.
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
        Create your avatar, interact with students in real time, explore multiplayer spaces and
        experience a modern 2D metaverse designed for connection and learning.
      </p>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link to="/signup">
          <Button
            size="lg"
            className="group h-12 rounded-xl px-7 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.03]"
          >
            <Users className="mr-2 h-4 w-4" />
            Create Avatar
          </Button>
        </Link>

        <Link to="/login">
          <Button
            variant="secondary"
            size="lg"
            className="h-12 rounded-xl border border-white/10 bg-white/5 px-7 text-base text-white backdrop-blur transition-all duration-300 hover:bg-white/10"
          >
            Log In
            <LogIn className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default CTASection;
