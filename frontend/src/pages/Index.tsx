import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WorldGrid from "@/components/WorldGrid";
import MetaverseCard from "@/components/MetaverseCard";
import { Globe, Users, Zap, Palette, GamepadIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Index = () => {
  const features = [
    {
      title: "Explore Vast Worlds",
      description:
        "Navigate through pixel-perfect landscapes and discover hidden treasures in our expansive 2D universe.",
      icon: <Globe className="h-6 w-6 text-white" />,
      color: "from-metaverse-blue to-metaverse-green",
    },
    {
      title: "Connect with Friends",
      description:
        "Meet new people, chat with friends, and build communities in a vibrant social experience.",
      icon: <Users className="h-6 w-6 text-white" />,
      color: "from-metaverse-purple to-metaverse-pink",
    },
    {
      title: "Lightning Fast Performance",
      description:
        "Enjoy smooth interactions and real-time updates powered by cutting-edge web technologies.",
      icon: <Zap className="h-6 w-6 text-white" />,
      color: "from-metaverse-yellow to-metaverse-pink",
    },
    {
      title: "Create & Customize",
      description:
        "Design your own avatar, build personal spaces, and express yourself through pixel art.",
      icon: <Palette className="h-6 w-6 text-white" />,
      color: "from-metaverse-green to-metaverse-blue",
    },
    {
      title: "Play Mini-Games",
      description:
        "Challenge friends to exciting mini-games and climb the leaderboards with your high scores.",
      icon: <GamepadIcon className="h-6 w-6 text-white" />,
      color: "from-metaverse-pink to-metaverse-purple",
    },
    {
      title: "Join Communities",
      description:
        "Find like-minded people and join thriving communities centered around your interests.",
      icon: <Heart className="h-6 w-6 text-white" />,
      color: "from-metaverse-yellow to-metaverse-green",
    },
  ];
  return (
    <div className="min-h-screen bg-metaverse-dark text-white">
      <Navbar />

      <main>
        <Hero />

        {/* Live World Preview */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Live World Preview</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                See the PixelVerse in action! Watch as users navigate through
                our virtual world in real-time.
              </p>
            </div>

            <WorldGrid />
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-metaverse-dark/80">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Metaverse Features</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Explore all the amazing experiences waiting for you in our 2D
                metaverse
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <MetaverseCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  color={feature.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-metaverse-purple/20 to-metaverse-blue/20 z-0"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 glow-text">
              Ready to Enter the PixelVerse?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of explorers already creating, connecting, and
              playing in our vibrant 2D metaverse. Your digital adventure begins
              now!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-metaverse-purple to-metaverse-blue hover:opacity-90"
              >
                <Link to="/signup" className="flex items-center">
                  Create Your Avatar
                  <Users className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <Link to="/login">Log In To Continue</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-metaverse-purple/20">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-400">
          <p>© 2025 PixelVerse Metaverse • All Rights Reserved</p>
          <p className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-metaverse-purple/10 text-metaverse-purple">
              <span className="w-2 h-2 rounded-full bg-metaverse-green mr-1.5 animate-pulse"></span>
              Online Users: 1,254
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
