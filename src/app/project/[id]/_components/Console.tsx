import { useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

interface ConsoleProps {
  output: string;
  isRunning: boolean;
  input: string;
  setInput: (input: string) => void;
}

export default function Console({ output, isRunning, input, setInput }: ConsoleProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);


  return (
    <div className="h-64 rounded-md border border-neutral-800 bg-neutral-900 flex flex-col shadow-lg">
      <div className="flex h-10 items-center border-b border-neutral-800 bg-neutral-800">
        <div className="px-4 py-2 text-sm font-semibold tracking-wide text-white">
          Console
        </div>
        <div className="flex-1"></div>
        <div className="px-4">
          {isRunning && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <FaSpinner className="animate-spin" />
              Running...
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-row">
        {/* Output panel */}
        <div className="w-1/2 border-r border-neutral-800">
          <div className="px-3 py-2 text-xs font-medium text-neutral-400 border-b border-neutral-800">
            Output
          </div>
          <div
            ref={outputRef}
            className="h-[calc(100%-30px)] overflow-auto p-4 font-jetbrains text-sm text-neutral-200 bg-neutral-950 leading-relaxed"
          >
            {output.split('\n').map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line || ' '}
              </div>
            ))}
            {isRunning && output.length > 0 && (
              <div className="text-blue-400 mt-2">
                <FaSpinner className="animate-spin inline mr-2" />
                Processing...
              </div>
            )}
          </div>
        </div>

        {/* Input panel */}
        <div className="w-1/2 flex flex-col">
          <div className="px-3 py-2 text-xs font-medium text-neutral-400 border-b border-neutral-800">
            Input
          </div>
          <div className="h-[calc(100%-30px)] flex flex-col">
            <textarea
              className="flex-1 bg-neutral-900 text-neutral-200 p-3 resize-none font-jetbrains text-sm border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter input for your program here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isRunning}
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
