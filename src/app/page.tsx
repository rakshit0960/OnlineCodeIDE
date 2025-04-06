"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Hero Section */}
        <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start w-full max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-16 w-full">
            <div className="flex flex-col items-center sm:items-start md:w-1/2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold mb-6 text-center sm:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 leading-tight"
              >
                AI-Powered Cloud Code Compiler
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center sm:text-left mb-10 max-w-xl"
              >
                Write, compile, and run your code with AI assistance in the cloud - no setup required.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex gap-5 items-center flex-col sm:flex-row"
              >
                <Link
                  className="rounded-full border border-solid border-transparent transition-all flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white gap-2 hover:opacity-90 hover:shadow-lg hover:shadow-blue-500/20 text-sm sm:text-base h-14 px-8 font-medium"
                  href="/dashboard"
                >
                  Start Coding Now
                </Link>
                <Link
                  className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-all flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent hover:shadow-md text-sm sm:text-base h-14 px-8 sm:min-w-44 font-medium"
                  href="/dashboard"
                >
                  View Documentation
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:w-1/2 w-full max-w-xl"
            >
              <div className="w-full bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-xl backdrop-blur-sm border border-black/5 dark:border-white/10 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-sm font-[family-name:var(--font-geist-mono)] bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">main.py</div>
                  <div className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">AI Assistant</div>
                </div>
                <pre className="text-sm font-[family-name:var(--font-geist-mono)] overflow-x-auto bg-gray-50 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
                  <code className="text-gray-800 dark:text-gray-200">
                    {`# AI-suggested solution
def analyze_data(data):
    """
    Analyze input data and return insights
    """
    results = {}

    # Process the data
    if data:
        results["count"] = len(data)
        results["summary"] = "Data analysis complete"

    return results

if __name__ == "__main__":
    sample_data = [1, 2, 3, 4, 5]
    print(analyze_data(sample_data))`}
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-6xl mt-8"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl border border-black/5 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-3 text-blue-500 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">✨</span>
                AI Code Assistance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get intelligent code suggestions, bug fixes, and optimizations as you type.
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl border border-black/5 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-3 text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">🔄</span>
                Real-time Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Work together with your team in real-time on the same codebase.
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl border border-black/5 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-3 text-purple-500 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">⚡</span>
                Instant Execution
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Compile and run your code with zero setup or configuration.
              </p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl border border-black/5 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-3 text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">☁️</span>
                Cloud Storage
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Your projects are automatically saved and accessible from anywhere.
              </p>
            </div>
          </motion.div>
        </main>

        <footer className="row-start-3 flex gap-8 flex-wrap items-center justify-center bg-white/50 dark:bg-gray-800/50 py-4 px-8 rounded-full backdrop-blur-sm shadow-md">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="#"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={18}
              height={18}
              className="opacity-80"
            />
            Tutorials
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="#"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={18}
              height={18}
              className="opacity-80"
            />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="#"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={18}
              height={18}
              className="opacity-80"
            />
            Community
          </a>
        </footer>
      </div>
    </>
  );
}
