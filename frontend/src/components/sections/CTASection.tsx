import { Link } from "react-router";
import { Button } from "../ui/button";
import { Users } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="absolute inset-0"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 mx-auto bg-black w-fit">
          Ready to Enter the Metaverse?
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto bg-black">
          Join thousands of explorers already creating, connecting, and playing in our
          vibrant 2D metaverse. Your digital adventure begins now!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="flex items-center">
            <Button
              size="lg"
              className="bg-sky-500 text-black hover:text-white hover:bg-sky-500/30 border"
            >
              Create Your Avatar
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link to="/login">
            <Button size="lg" className="border hover:bg-sky-500/30">
              Log In To Continue
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
