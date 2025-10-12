import { Link } from "react-router";
import { LogIn, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="border-t py-40 text-white">
    <div className="relative mx-10 text-center">
      <h2 className="mb-6 text-2xl font-bold md:text-4xl">Ready to Enter the Metaverse?</h2>
      <p className="mb-10 text-gray-300">
        Join thousands of explorers already creating, connecting, and playing in our vibrant 2D{" "}
        <br className="hidden md:block" />
        metaverse. Your digital adventure begins now!
      </p>

      <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-10">
        <Link
          to="/signup"
          className="flex items-center *:transition-all *:duration-300 *:hover:border *:hover:bg-sky-500/30 *:hover:text-white"
        >
          <Button size="lg" className="text-black">
            <Users />
            Create Your Avatar
          </Button>
        </Link>

        <Link
          to="/login"
          className="*:transition-all *:duration-300 *:hover:border *:hover:bg-sky-500/30 *:hover:text-white"
        >
          <Button size="lg" className="text-black">
            Log In To Continue
            <LogIn />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default CTASection;
