"use client";

import GoogleButton from "@/components/GoogleButton";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";

// const signInSchema = z.object({
//   email: z.string().email("Please enter a valid email").min(1, "Email is required"),
//   password: z.string().min(1, "Password is required"),
// });

// type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<SignInFormData>({
  //   resolver: zodResolver(signInSchema),
  // });

  // const onSubmit = async (data: SignInFormData) => {
  //   setError("");
  //   setIsLoading(true);

  //   try {
  //     const result = await signIn("credentials", {
  //       email: data.email,
  //       password: data.password,
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       setError(result.error);
  //     } else if (result?.ok) {
  //       window.location.href = "/dashboard";
  //     }
  //   } catch (error) {
  //     console.error("Error signing in with email/password", error);
  //     setError("An unexpected error occurred");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="absolute z-[-1] top-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-gray-800/90 backdrop-blur-sm p-8 shadow-xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Code Compiler
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to your cloud compiler workspace
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <GoogleButton />
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-800 px-2 text-gray-300">
                Or sign in with email
              </span>
            </div>
          </div> */}
          {/*
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Your Email Address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  {...register("password")}
                  type="password"
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="text-red-400 text-sm mt-2 bg-red-900/20 p-2 rounded-md border border-red-800">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <ImSpinner8 className="mr-3 h-5 w-5 animate-spin text-blue-400" />
                ) : (
                  "Sign in with Email"
                )}
              </button>
            </div>
          </form> */}

          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/sign-up"
              className="flex items-center text-blue-500 hover:text-blue-400 transition-colors duration-200"
            >
              <FaUserPlus className="mr-1 h-3.5 w-3.5" />
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
