"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";

export default function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className={`group relative flex w-full justify-center items-center rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 transition-all duration-200 transform hover:-translate-y-0.5`}
    >
      {isLoading ? (
        <ImSpinner8 className="mr-3 h-5 w-5 animate-spin text-emerald-400" />
      ) : (
        <FcGoogle className="mr-3 h-5 w-5" />
      )}
      <span className="font-medium">{"Sign in with Google"}</span>
    </button>
  );
}
