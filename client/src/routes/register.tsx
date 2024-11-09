/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/fetch";
import { registerSchema } from "@/lib/schema";
// import { useProcessStore } from "@/lib/store/stateStore";
// import axios from "axios";
import { Loader2 } from "lucide-react";
// import logo from "@/assets/tranzact.svg"
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/build/Logo";
import { useState } from "react";

type RegisterSchemaType = z.infer<typeof registerSchema>;

// export async function Loader() {
//   const user = Cookies.get("user_access");
//   if (user) {
//     return redirect("/dashboard");
//   }

//   return json(null);
// }

export default function Register() {
  // const { process, setProcess } = useProcessStore();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterSchemaType) => {
    setLoading(!loading);

    try {
      const response = await axiosInstance.post(`/auth/register`, {
        name: data.fullname,
        email: data.email,
        username: data.username,
        password: data.password,
      });

      console.log(response);
      console.log(response.data);

      // if (response.data.error) {
      //   toast({
      //     variant: "destructive",
      //     description: `User with this email already exists!`,
      //   });
      //   return null;
      // }

      toast({
        title: `Welcome to Tranzact, ${data.username}`,
        description: `Login to continue to Tranzact`,
      });
      // return navigate("/login");
    } catch (error: any) {
      console.log(error);

      // if (error.request) {
      //   toast({
      //     variant: "destructive",
      //     title: "Uh oh! Something went wrong.",
      //     description: "There was a problem with your request.",
      //   });
      //   return null;
      // } else {
      //   toast({
      //     variant: "destructive",
      //     description: "Something went wrong, try again later!",
      //   });
      //   return null;
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="h-full w-full px-2 py-4 sm:w-2/3 md:w-1/2">
          <div className="mx-auto flex flex-col justify-center px-2">
            <div className="mb-2">
              <Logo className="" text="Converse" />
            </div>

            <h1 className="text-2xl font-medium">Join the Conversation!</h1>
            <Label className="text-neutral-500">
              Create your account to start chatting with friends, family, and
              communities!{" "}
            </Label>

            <form
              method="post"
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-y-4"
            >
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input
                  type="text"
                  {...register("fullname")}
                  placeholder="Your full name, so others know who you are."
                />
                {errors.fullname && (
                  <Label className="text-xs text-red-500">
                    {errors.fullname?.message}
                  </Label>
                )}
              </div>
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input
                  type="text"
                  {...register("email")}
                  placeholder="Enter a valid email to get started."
                />
                {errors.email && (
                  <Label className="text-xs text-red-500">
                    {errors.email?.message}
                  </Label>
                )}
              </div>
              <div>
                <Label className="text-xs">Username</Label>
                <Input
                  type="text"
                  {...register("username")}
                  placeholder="Pick a unique username for your profile."
                />
                {errors.username && (
                  <Label className="text-xs text-red-500">
                    {errors.username?.message}
                  </Label>
                )}
              </div>
              <div>
                <Label className="text-xs">Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Create a secure password to protect your account."
                />
                {errors.password && (
                  <Label className="text-xs text-red-500">
                    {errors.password?.message}
                  </Label>
                )}
              </div>

              <Button type="submit" className="mt-4">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign Up and Start Chatting!"
                )}
              </Button>

              <p className="flex items-center gap-2 text-center text-sm font-medium text-neutral-500">
                Already have an account?{" "}
                <Link to="/login" className="underline-offset-1">
                  <span className="text-purple-600">Log in here</span>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
