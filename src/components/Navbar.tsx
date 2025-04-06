"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isSignInPage = pathname === "/sign-in";
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isProjectPage = pathname.includes("/project/");

  // Use a more minimal navbar for auth pages
  if (isAuthPage) {
    return (
      <nav className="bg-gray-900 shadow-md shadow-gray-900/30">
        <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-3 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>CodeCompiler</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  if (isProjectPage) {
    return null;
  }

  return (
    <nav
      className={`sticky top-0 z-50 bg-gray-900 transition-all duration-300`}
    >
      <div className="mx-auto max-w-full px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link
                href="/"
                className="flex items-center space-x-3 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span className="hidden sm:inline">CodeCompiler</span>
                <span className="sm:hidden">CC</span>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-10">
              <Link
                href="/"
                className={`inline-flex items-center px-2 pt-1 text-sm font-medium transition-colors relative ${
                  pathname === "/"
                    ? "text-gray-100"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Home
                {pathname === "/" && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-400"
                    layoutId="navbar-underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center px-2 pt-1 text-sm font-medium transition-colors relative ${
                      pathname === "/dashboard"
                        ? "text-gray-100"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Dashboard
                    {pathname === "/dashboard" && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-400"
                        layoutId="navbar-underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-700"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3">
                  {session.user?.image ? (
                    <Image
                      width={32}
                      height={32}
                      src={session.user.image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 font-semibold">
                      {session.user?.name?.charAt(0) ||
                        session.user?.email?.charAt(0) ||
                        "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="cursor-pointer rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-blue-300 transition-colors border border-gray-700 shadow-sm"
                >
                  Sign out
                </button>
              </div>
            ) : !isSignInPage ? (
              <Link
                href="/sign-in"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
              >
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
