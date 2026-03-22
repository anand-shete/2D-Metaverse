import api from "@/api";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { boy1, boy1Json, girl2, girl2Json } from "@/assets";
import { PlayerMoveAnimation } from "@/types/enum";
import { AnimatedSprite, Application, Assets, Spritesheet, Texture } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { CircleCheck } from "lucide-react";

const avatars = [
  { id: "boy1", texture: boy1, sheetData: boy1Json },
  { id: "girl2", texture: girl2, sheetData: girl2Json },
];

interface Props {
  isOpen: boolean;
  userId: string | null;
}

const SelectAvatar = ({ isOpen, userId }: Props) => {
  const [cApi, setCApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const spriteRef = useRef<AnimatedSprite | null>(null);
  const sheetsRef = useRef<Map<string, Spritesheet>>(new Map());
  const previewRequestIdRef = useRef(0);
  const navigate = useNavigate();

  const loadAvatarPreview = useCallback(async (index: number) => {
    const app = appRef.current;
    if (!app) return;
    const requestId = ++previewRequestIdRef.current;

    const avatar = avatars[index] ?? avatars[0];
    let sheet = sheetsRef.current.get(avatar.id);

    if (!sheet) {
      const texture = await Assets.load<Texture>(avatar.texture);
      sheet = new Spritesheet(texture, avatar.sheetData as any);
      await sheet.parse();
      sheetsRef.current.set(avatar.id, sheet);
    }

    if (appRef.current !== app || requestId !== previewRequestIdRef.current) return;

    if (spriteRef.current) {
      app.stage.removeChild(spriteRef.current);
      spriteRef.current.destroy();
      spriteRef.current = null;
    }

    const idleTextures = sheet.animations[PlayerMoveAnimation.IDLE];
    if (!idleTextures?.length) return;

    const sprite = new AnimatedSprite(idleTextures);
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    sprite.scale.set(2.2);
    sprite.animationSpeed = 0.1;
    sprite.play();
    app.stage.addChild(sprite);
    spriteRef.current = sprite;
  }, []);

  useEffect(() => {
    if (!previewRef.current) return;

    const app = new Application();
    let cancelled = false;

    app
      .init({
        width: 200,
        height: 200,
        backgroundAlpha: 0,
        antialias: false,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
      })
      .then(() => {
        if (cancelled || !previewRef.current) return;
        previewRef.current.appendChild(app.canvas as HTMLCanvasElement);
        appRef.current = app;
        void loadAvatarPreview(selectedIndex);
      })
      .catch((error: unknown) => {
        console.error("Unable to initialize avatar preview", error);
      });

    return () => {
      cancelled = true;
      previewRequestIdRef.current += 1;
      if (spriteRef.current) {
        spriteRef.current.destroy();
        spriteRef.current = null;
      }
      appRef.current?.destroy(true, true);
      appRef.current = null;
      sheetsRef.current.clear();
    };
  }, [loadAvatarPreview]);

  useEffect(() => {
    if (!appRef.current) return;
    void loadAvatarPreview(selectedIndex);
  }, [loadAvatarPreview, selectedIndex]);

  useEffect(() => {
    if (!cApi) return;

    const onSelect = () => {
      const nextIndex = cApi.selectedScrollSnap();
      setSelectedIndex(nextIndex);
    };

    onSelect();
    cApi.on("select", onSelect);
    cApi.on("reInit", onSelect);

    return () => {
      cApi.off("select", onSelect);
      cApi.off("reInit", onSelect);
    };
  }, [cApi, loadAvatarPreview]);

  const handleSubmit = async () => {
    try {
      const avatar = avatars[selectedIndex];
      const data = { userId, avatar: avatar.id };
      const res = await api.patch("/user/update-avatar", data);
      toast.success(res.data.message);
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`${isOpen ? "flex" : "hidden"} h-screen min-w-full items-center justify-center bg-blue-950`}
    >
      <div className="mx-10 flex w-md flex-col items-center justify-center space-y-4 rounded-xl bg-white py-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold md:text-2xl">Signup</h1>
          <p className="mb-4 text-gray-400">Select your virtual character</p>
        </div>
        <div
          ref={previewRef}
          className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-100"
        />
        <Carousel opts={{ loop: true }} setApi={setCApi}>
          <CarouselContent>
            {avatars.map(avatar => (
              <CarouselItem key={avatar.id}></CarouselItem>
            ))}
          </CarouselContent>
          <div className="my-4 mb-9 *:border-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
        <Button onClick={handleSubmit}>
          Sign Up
          <CircleCheck />
        </Button>
      </div>
    </div>
  );
};

export default SelectAvatar;
