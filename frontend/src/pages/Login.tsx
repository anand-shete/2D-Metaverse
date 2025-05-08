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
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar, Footer } from "@/components";
import { useForm } from "react-hook-form";

const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function Login() {
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
      const res = await api.post("/login", data);
      toast.success(res.data.message);
      navigate("/canvas");
    } catch (error: any) {
      console.log("error", error.response.data);
      toast.error(error.response.data.message || "Login Failed");
    }
  };

  return (
    <div className="bg-slate-900">
      <Navbar />
      <div className="flex flex-row min-h-svh mt-10 w-full items-center justify-center md:p-10">
        <div className="w-full max-w-sm rounded-2xl shadow-custom shadow-sky-300">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Login to the Metaverse</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(submit)}
                  className="flex flex-col space-y-5"
                >
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
                    Login
                  </Button>
                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="underline underline-offset-4">
                      Signup
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
