import z from "zod";
import api from "@/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, CircleChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SignupSchema } from "@/schema";
import signupBg from "@/assets/signup/signup.png";

interface Props {
  isOpen: boolean;
  onSignupSuccess: (userId: string) => void;
}

const SignupSection = ({ isOpen, onSignupSuccess }: Props) => {
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const submit = async (data: z.infer<typeof SignupSchema>) => {
    try {
      const res = await api.post("/user/signup", data);
      onSignupSuccess(res.data.userId);
    } catch (error: any) {
      toast.error(error.response.data.message || "Account creation failed");
    }
  };

  return (
    <div
      className={`relative flex min-h-svh items-center justify-center overflow-hidden bg-black/90 px-6 py-20 ${isOpen ? "hidden" : "flex"} `}
    >
      <div className="relative mt-20 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Join the shared virtual campus.
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">
            Create an account to explore multiplayer rooms, communicate in real time and interact
            inside the metaverse environment.
          </p>

          <div className="mt-6 border-none text-white">
            <div className="pl-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                              id="username"
                              type="text"
                              placeholder="john_doe"
                              className="focus-visible:ring-primary h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500"
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>

                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                              id="email"
                              type="email"
                              placeholder="john@gmail.com"
                              className="focus-visible:ring-primary h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500"
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>

                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              className="focus-visible:ring-primary h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500"
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-2 h-11 w-full text-base font-semibold">
                    Continue
                    <CircleChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-white underline underline-offset-4"
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 z-10 bg-black/40" />

          <img
            src={signupBg}
            alt="Metaverse preview"
            className="h-full w-full object-cover brightness-75"
          />

          <div className="absolute bottom-10 left-10 z-20 max-w-md">
            <h2 className="text-3xl font-bold text-white">
              Connect with students inside immersive multiplayer spaces.
            </h2>
            <p className="mt-4 text-sm text-slate-300">
              Experience world chat, collaborative rooms, voice communication and AI-powered
              interactions inside a shared digital environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSection;
