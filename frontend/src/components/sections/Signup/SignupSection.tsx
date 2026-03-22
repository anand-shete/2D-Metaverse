import z from "zod";
import api from "@/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, CircleChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      className={`mt-10 min-h-svh w-full flex-row items-center justify-center bg-blue-950 md:p-10 ${isOpen ? "hidden" : "flex"}`}
    >
      <div className="mx-10 w-md rounded-2xl shadow-sm shadow-sky-300 transition-shadow hover:shadow-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl">Signup</CardTitle>
            <CardDescription className="md:text-md text-sm">
              Join the Metaverse Community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)} className="flex flex-col space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="username" className="ml-1">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute top-1/2 left-3 h-4 -translate-y-1/2 transform" />
                          <Input
                            placeholder="rizwaan"
                            type="text"
                            id="username"
                            {...field}
                            className="border-3 pl-10"
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
                      <FormLabel htmlFor="email" className="ml-1">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute top-1/2 left-3 h-4 -translate-y-1/2" />
                          <Input
                            id="email"
                            placeholder="rizwaan@gmail.com"
                            type="email"
                            className="border-3 pl-10"
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
                      <FormLabel htmlFor="password" className="ml-1">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute top-1/2 left-3 h-4 -translate-y-1/2" />
                          <Input
                            id="password"
                            placeholder="••••••"
                            type="password"
                            {...field}
                            className="border-3 pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="mt-5">
                  Continue
                  <CircleChevronRight />
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupSection;
