import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PixelAvatar } from "@/components";
import Navbar from "@/components/Navbar";
import { User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarColor, setAvatarColor] = useState("#8B5CF6");

  const colorOptions = [
    "#8B5CF6", // purple
    "#0EA5E9", // blue
    "#D946EF", // pink
    "#10B981", // green
    "#F59E0B", // yellow
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match.",
      });
      setIsLoading(false);
      return;
    }

    // Simulate sign up
    setTimeout(() => {
      setIsLoading(false);
      if (username && email && password) {
        toast.success("Account created!", {
          description: "Welcome to the PixelVerse! You can now login.",
        });
      } else {
        toast.error("Sign up failed", {
          description: "Please fill in all required fields.",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1a1f2c]">
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-8">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-metaverse-blue to-metaverse-pink opacity-50 blur-xl -z-10 rounded-2xl"></div>
            <div className="bg-card/90 backdrop-blur-md shadow-xl border border-white/10 rounded-xl p-8 relative z-10">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <PixelAvatar color={avatarColor} size="lg" />
                </div>
                <h1 className="text-2xl font-bold">Create Your Account</h1>
                <p className="text-muted-foreground">
                  Join the PixelVerse metaverse community
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="coolpixel"
                      className="pl-10"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Choose Avatar Color</Label>
                  <div className="flex justify-between mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          avatarColor === color ? "ring-2 ring-white" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setAvatarColor(color)}
                      >
                        {avatarColor === color && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link
                      to="#"
                      className="text-metaverse-blue hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      className="text-metaverse-blue hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-metaverse-blue to-metaverse-pink hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <span className="flex items-center">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-metaverse-blue hover:underline font-medium"
                  >
                    Log in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
