import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/api";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, CircleArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema";

const LoginSection = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const res = await api.post("/user/login", data);
      toast.success(res.data.message);
      navigate("/metaverse");
    } catch (error: any) {
      toast.error(error.response.data.message || "Login Failed");
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center overflow-hidden bg-black/90">
      <div className="mt-10 w-full max-w-lg rounded-3xl border border-slate-500 bg-white/5 p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Welcome Back.
          </h1>
          <p className="mt-2 text-sm text-slate-400">Continue your metaverse journey.</p>
        </div>

        <div className="rounded-3xl">
          <div className="pt-6 text-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
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
                            placeholder="example@gmail.com"
                            autoComplete="email"
                            className="focus-visible:ring-primary h-11 border-white/10 pl-10 text-white"
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
                            className="focus-visible:ring-primary h-11 border-white/10 pl-10 text-white"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-2 h-11 w-full text-base font-semibold">
                  Login
                  <CircleArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="text-center text-sm text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-white underline underline-offset-4"
                  >
                    Signup
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
