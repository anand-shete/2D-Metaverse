import { Link } from "react-router";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="border-t py-40 text-white">
    <div className="relative mx-auto w-fit text-center">
      <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Enter the Metaverse?</h2>
      <p className="mb-10 text-lg text-gray-300">
        Join thousands of explorers already creating, connecting, and playing in our vibrant 2D{" "}
        <br />
        metaverse. Your digital adventure begins now!
      </p>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          to="/signup"
          className="flex items-center *:border-gray-400 *:text-black *:transition-all *:duration-300 *:hover:border *:hover:bg-sky-500/30 *:hover:text-white"
        >
          <Button size="lg" className="mr-3">
            <Users />
            Create Your Avatar
          </Button>
        </Link>

        <Link
          to="/login"
          className="*:border-gray-400 *:text-black *:transition-all *:duration-300 *:hover:border *:hover:bg-sky-500/30 *:hover:text-white"
        >
          <Button size="lg">Log In To Continue</Button>
        </Link>
      </div>
    </div>
  </section>
);

export default CTASection;
