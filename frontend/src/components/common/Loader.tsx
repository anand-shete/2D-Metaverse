import { motion } from "motion/react";

export default function Loader() {
  return (
    <div className="relative flex min-h-screen min-w-full items-center justify-center bg-slate-800">
      <motion.div
        className="absolute h-20 w-20 rounded-full border-t-4 border-blue-500 sm:scale-200"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </div>
  );
}
