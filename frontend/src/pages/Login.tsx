import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Lock, Mail, ArrowRight, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        toast("Login Successful!", {
          description: "Welcome back to the PixelVerse!",
        });
      } else {
        toast.error("Login Failed", {
          description: "Please check your credentials and try again.",
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
            <div className="absolute inset-0 bg-gradient-to-r from-metaverse-purple to-metaverse-blue opacity-50 blur-xl -z-10 rounded-2xl"></div>
            <div className="bg-card/90 backdrop-blur-md shadow-xl border border-white/10 rounded-xl p-8 relative z-10">
              <div className="text-center mb-6">
                <LogIn className="h-12 w-12 mx-auto text-metaverse-purple mb-2" />
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">
                  Log in to continue your metaverse journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="#"
                      className="text-xs text-metaverse-blue hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
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

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-metaverse-purple to-metaverse-blue hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    <span className="flex items-center">
                      Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-metaverse-blue hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            By logging in, you agree to our{" "}
            <Link to="#" className="text-metaverse-blue hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-metaverse-blue hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
