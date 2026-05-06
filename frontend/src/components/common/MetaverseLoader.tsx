import { ClimbingBoxLoader } from "react-spinners";
import TextType from "@/components/ui/TextType";

const MetaverseLoader = () => {
  return (
    <>
      <div className="text-md flex h-screen min-w-full flex-col items-center justify-center bg-black/90 pb-40 font-semibold tracking-tight text-white md:text-3xl">
        <ClimbingBoxLoader color="#ffffff" size={14} />
        <TextType
          text={[
            "Initializing Virtual World...",
            "Configuring Physics...",
            "Loading Avatars...",
          ]}
          typingSpeed={50}
          pauseDuration={800}
          showCursor
          cursorCharacter="_"
          deletingSpeed={30}
          cursorBlinkDuration={0.5}
        />
      </div>
    </>
  );
};

export default MetaverseLoader;
