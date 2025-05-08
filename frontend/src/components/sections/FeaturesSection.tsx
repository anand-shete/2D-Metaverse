import { cn } from "@/lib/utils";
import { GamepadIcon, Globe, Heart, Palette, Users, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Explore Vast Worlds",
      description:
        "Navigate through pixel-perfect landscapes and discover hidden treasures in our expansive 2D universe.",
      icon: <Globe className="h-6 w-6 text-white" />,
      color: "from-[#0EA5E9] to-[#10B981]",
    },
    {
      title: "Connect with Friends",
      description:
        "Meet new people, chat with friends, and build communities in a vibrant social experience.",
      icon: <Users className="h-6 w-6 text-white" />,
      color: "from-[#8B5CF6] to-[#D946EF]",
    },
    {
      title: "Lightning Fast Performance",
      description:
        "Enjoy smooth interactions and real-time updates powered by cutting-edge web technologies.",
      icon: <Zap className="h-6 w-6 text-white" />,
      color: "from-[#F59E0B] to-[#D946EF]",
    },
    {
      title: "Create & Customize",
      description:
        "Design your own avatar, build personal spaces, and express yourself through pixel art.",
      icon: <Palette className="h-6 w-6 text-white" />,
      color: "from-[#10B981] to-[#0EA5E9]",
    },
    {
      title: "Play Mini-Games",
      description:
        "Challenge friends to exciting mini-games and climb the leaderboards with your high scores.",
      icon: <GamepadIcon className="h-6 w-6 text-white" />,
      color: "from-[#D946EF] to-[#8B5CF6]",
    },
    {
      title: "Join Communities",
      description:
        "Find like-minded people and join thriving communities centered around your interests.",
      icon: <Heart className="h-6 w-6 text-white" />,
      color: "from-[#F59E0B] to-[#10B981]",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-900/70">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Metaverse Features</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore all the amazing experiences waiting for you in our 2D metaverse
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature,index) => (
            <div
            key={index}
              className={cn(
                "relative rounded-lg overflow-hidden transition-all duration-300",
                "hover:scale-105 hover:shadow-lg",
                "border border-white/10 backdrop-blur-md",
                "bg-gradient-to-br from-white/5 to-white/10"
              )}
            >
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20`}
                ></div>
              </div>

              <div className="relative p-6">
                <div
                  className={`inline-flex rounded-full p-3 bg-gradient-to-br ${feature.color}`}
                >
                  {feature.icon}
                </div>

                <h3 className="mt-4 text-lg font-medium text-white">{feature.title}</h3>

                <p className="mt-2 text-sm text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
