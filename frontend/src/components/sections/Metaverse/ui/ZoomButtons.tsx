import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

const ZoomButtons = () => (
  <div className="absolute right-4 bottom-25 flex flex-col gap-2">
    <Button id="zoom-in" className="rounded border opacity-80">
      <ZoomIn />
    </Button>
    <Button id="zoom-out" className="rounded border opacity-80">
      <ZoomOut />
    </Button>
  </div>
);

export default ZoomButtons;
