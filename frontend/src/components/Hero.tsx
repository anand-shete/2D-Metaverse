import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ArrowRight, Users } from "lucide-react";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];

    const colors = ["#8B5CF6", "#0EA5E9", "#D946EF", "#10B981", "#F59E0B"];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = p.color + "40"; // Add transparency
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      ctx.strokeStyle = "#8B5CF630";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center pb-20">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs md:text-sm font-medium bg-metaverse-purple/10 border border-metaverse-purple/20 text-metaverse-purple">
          Welcome to the Future of Digital Space
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight  mb-6">
          Explore the Infinite Possibilities of
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-metaverse-purple via-metaverse-blue to-metaverse-pink block mt-2">
            2D PixelVerse
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-300 mb-8">
          Connect, create, and collaborate in our immersive 2D metaverse. Join
          thousands of creative minds in building the digital future.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-metaverse-purple to-metaverse-blue hover:opacity-90"
          >
            <Link to="/signup" className="flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-metaverse-purple/50 text-metaverse-purple hover:bg-metaverse-purple/10"
          >
            <Link to="/login" className="flex items-center">
              Existing Users
              <Users className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-0"></div>
    </div>
  );
};

export default Hero;
