import TextType from "@/components/ui/TextType";

const MetaverseLoader = () => {
  return (
    <>
      <div className="text-md flex h-screen min-w-full items-center justify-center bg-black/90 pb-20 font-semibold tracking-tight text-white md:text-3xl">
        <TextType
          text={[
            "Initializing Virtual Environment...",
            "Configuring Physics Engine...",
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
