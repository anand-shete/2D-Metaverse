import { motion } from "motion/react";
import video from "@/assets/landing/video.mp4";

export default function LiveVideoSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-400 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl leading-tight font-bold text-white md:text-5xl">
            Explore a shared virtual <br /> campus in real time.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Explore multiplayer rooms, live chat, MetaBot assistance and
            interactive experiences demonstrated directly inside the platform.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="relative mx-auto mt-12 max-w-4xl"
        >
          <div className="bg-primary/10 absolute inset-0 rounded-4xl blur-3xl" />

          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-5 py-4">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />

              <div className="ml-4 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                Metaverse Preview
              </div>
            </div>

            <div className="bg-black">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="mx-auto w-full max-w-4xl object-contain"
              >
                <source src={video} type="video/mp4" />
              </video>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3"
        >
          {[
            "Real-Time Multiplayer",
            "World Chat",
            "Voice & Video Communication",
            "Agentic AI Assistant",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-sky-800 bg-white/5 px-5 py-2 text-sm text-sky-300 backdrop-blur"
            >
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
