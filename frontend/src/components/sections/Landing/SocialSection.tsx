import { motion } from "motion/react";
import social from "@/assets/landing/social.png";

export default function SocialProofSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-400 bg-black/80 py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <div className="mb-4 inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1 text-sm font-medium text-sky-300">
            Real-Time Collaboration
          </div>

          <h2 className="text-4xl leading-tight font-bold text-white md:text-5xl">
            Study, chat and interact in a shared virtual campus.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Meet other students, join conversations, collaborate together and experience real-time
            interaction inside a shared digital space.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">Real-Time</p>
              <p className="mt-1 text-sm text-gray-400">Voice & video communication</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
              <p className="text-2xl font-bold text-white">Shared Spaces</p>
              <p className="mt-1 text-sm text-gray-400">Explore rooms together</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-4xl"
        >
          <div className="bg-primary/30 absolute inset-0 rounded-2xl blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-6 py-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="ml-4 rounded-md bg-black/30 px-3 py-1 text-xs text-gray-400">
                Virtual World
              </div>
            </div>
            <img
              src={social}
              alt="Students interacting inside the metaverse"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
