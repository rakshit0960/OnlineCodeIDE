import { FaCode, FaPython, FaJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiC } from "react-icons/si";
import { twMerge } from "tailwind-merge";

export default function LanguageIcon({ language, className }: { language: string, className?: string }) {
    switch (language.toUpperCase()) {
      case "PYTHON":
        return <FaPython className={twMerge("w-5 h-5 mr-2 text-blue-400", className)} />;

      case "C":
        return <SiC className={twMerge("h-5 w-5 text-blue-400", className)} />

      case "JAVASCRIPT":
        return <FaJs className={twMerge("w-5 h-5 mr-2 text-blue-400", className)} />

      case "HTML":
        return <FaHtml5 className={twMerge("w-5 h-5 mr-2 text-blue-400", className)} />

      case "CSS":
        return <FaCss3Alt className={twMerge("w-5 h-5 mr-2 text-blue-400", className)} />

      default:
        return <FaCode className={twMerge("w-5 h-5 mr-2 text-gray-400", className)} />;
    }
}