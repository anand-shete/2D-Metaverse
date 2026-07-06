import { cn } from "@/lib/utils";
import { BookOpen, Bot, Edit3, MapIcon, Music, Video } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Custom Avatars",
      description:
        "Choose your custom avatar and explore one massive, continuous map that serves as a centralized hub for all your digital activities.",
      icon: <MapIcon className="h-6 w-6" />,
    },
    {
      title: "Immersive Social Interactions",
      description:
        "Beyond standard chat, connect deeply with other players using integrated high-fidelity audio and video functionality across the map.",
      icon: <Video className="h-6 w-6" />,
    },
    {
      title: "Digital Knowledge Hub",
      description:
        "Visit the Library room to access the National Digital Library of India, bringing a massive world of academic resources into the virtual space.",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      title: "Interactive Lecture Suites",
      description:
        "Collaborate effectively in the Lecture room using integrated whiteboards for brainstorming and seamless S3-powered file uploads.",
      icon: <Edit3 className="h-6 w-6" />,
    },
    {
      title: "Dynamic Social Spaces",
      description:
        "Blow off steam in the Disco room with Spotify integration or explore a variety of functional rooms designed for specific utilities.",
      icon: <Music className="h-6 w-6" />,
    },
    {
      title: "Metabot: Your AI Guide",
      description:
        "Interact with our Agentic AI assistant that can analyze your uploaded notes and provide instant, context-aware answers in real-time.",
      icon: <Bot className="h-6 w-6" />,
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-slate-400 bg-black/80 py-28 text-white">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl leading-tight font-bold text-white md:text-5xl">
            Everything needed for real-time student interaction.
          </h2>
          <p className="mt-2 text-lg leading-8 text-slate-400">
            Built with multiplayer communication, collaborative spaces,
            AI-powered assistance and interactive experiences designed for
            modern digital campuses.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "bg-linear-to-br from-white/5 to-white/14",
                "group relative overflow-hidden rounded-3xl border border-white/10",
                "bg-white/3 p-7 backdrop-blur-xl",
                "transition-all duration-300",
                "hover:border-primary/30 hover:-translate-y-1 hover:bg-white/5",
              )}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div className="relative z-10 flex flex-col">
                <div className="flex flex-row items-center">
                  <div className="text-primary rounded-2xl border border-white/10 bg-white/5 p-4">
                    {feature.icon}
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
