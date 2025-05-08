import { Link, useNavigate } from "react-router";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  CardDescription,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar, Footer } from "@/components";
import { useForm } from "react-hook-form";

const SignupSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function Signup() {
  const navigate = useNavigate();

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
      const res = await api.post("/signup", data);
      toast.success(res.data.message);
    } catch (error: any) {
      console.log("error", error.response.data);
      toast.error(error.response.data.message || "Account creation failed");
    }
  };

  return (
    <div className="bg-slate-900">
      <Navbar />
      <div className="flex flex-row min-h-svh mt-10 w-full items-center justify-center md:p-10">
        <div className="w-full max-w-sm rounded-2xl shadow-custom shadow-sky-300">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Signup</CardTitle>
              <CardDescription className="text-sm">
                Join the SIES Metaverse Community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(submit)}
                  className="flex flex-col space-y-5"
                >
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
                            <User className="h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <Input
                              placeholder="mr-bean"
                              type="text"
                              id="username"
                              {...field}
                              className="pl-10 border-3"
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
                            <Mail className="absolute h-4 left-3 top-1/2 -translate-y-1/2" />
                            <Input
                              id="email"
                              placeholder="exmaple@gmail.com"
                              type="email"
                              autoComplete="text"
                              className="pl-10 border-3"
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
                            <Lock className="h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                              id="password"
                              placeholder="••••••"
                              type="password"
                              {...field}
                              className="pl-10 border-3"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-5">
                    Sign Up
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
      <Footer />
    </div>
  );
}
