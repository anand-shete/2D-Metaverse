import { cn } from "@/lib/utils";
import { BookOpen, Bot, Edit3, MapIcon, Music, Video } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Custom Avatars",
      description:
        "Choose your custom avatar and explore one massive, continuous map that serves as a centralized hub for all your digital activities.",
      icon: <MapIcon className="h-6 w-6" />,
      color: "from-[#F59E0B] to-[#10B981]",
    },
    {
      title: "Immersive Social Interactions",
      description:
        "Beyond standard chat, connect deeply with other players using integrated high-fidelity audio and video functionality across the map.",
      icon: <Video className="h-6 w-6" />,
      color: "from-[#8B5CF6] to-[#D946EF]",
    },
    {
      title: "Digital Knowledge Hub",
      description:
        "Visit the Library room to access the National Digital Library of India, bringing a massive world of academic resources into the virtual space.",
      icon: <BookOpen className="h-6 w-6" />,
      color: "from-[#F59E0B] to-[#D946EF]",
    },
    {
      title: "Interactive Lecture Suites",
      description:
        "Collaborate effectively in the Lecture room using integrated whiteboards for brainstorming and seamless S3-powered file uploads.",
      icon: <Edit3 className="h-6 w-6" />,
      color: "from-[#10B981] to-[#0EA5E9]",
    },
    {
      title: "Dynamic Social Spaces",
      description:
        "Blow off steam in the Disco room with Spotify integration or explore a variety of functional rooms designed for specific utilities.",
      icon: <Music className="h-6 w-6" />,
      color: "from-[#D946EF] to-[#8B5CF6]",
    },
    {
      title: "Metabot: Your AI Guide",
      description:
        "Interact with our Agentic AI assistant that can analyze your uploaded notes and provide instant, context-aware answers in real-time.",
      icon: <Bot className="h-6 w-6" />,
      color: "from-[#0EA5E9] to-[#10B981]",
    },
  ];

  return (
    <section className="min-w-full border-t bg-black/50 px-4 py-20 text-white">
      <div className="mx-10 md:mx-20 lg:mx-30">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Features</h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            Explore all the amazing experiences waiting for you in our 2D metaverse!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden rounded-lg transition-all duration-300",
                "hover:scale-105 hover:shadow-lg",
                "border border-white/10 backdrop-blur-md",
                "bg-linear-to-br from-white/5 to-white/14",
              )}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-20`}
                ></div>
              </div>

              <div className="relative flex flex-col space-y-4 p-6">
                <div className="flex items-center">
                  <div
                    className={`mr-5 inline-flex rounded-full bg-linear-to-br p-3 ${feature.color}`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-medium">{feature.title}</h3>
                </div>

                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
