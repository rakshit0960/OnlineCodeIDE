"use client";

import { Terminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { useParams } from "next/navigation";


export default function TerminalClient() {
  const params = useParams();
  const projectId = params.id as string;
  const terminalRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [commandBuffer, setCommandBuffer] = useState<string>("");

  useEffect(() => {
    if (!terminalRef.current) return;

    // Create a new terminal instance for each component mount
    const term = new Terminal({
      cursorBlink: true,    
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      scrollback: 1000, // Enable scrollback buffer
      theme: {
        background: "#1e1e1e",
        foreground: "#f0f0f0",
        cursor: "#f0f0f0",
        selectionBackground: "#5a5a5a",
        black: "#000000",
        red: "#e06c75",
        green: "#98c379",
        yellow: "#e5c07b",
        blue: "#61afef",
        magenta: "#c678dd",
        cyan: "#56b6c2",
        white: "#dcdfe4",
      },
    });


    // Add web links addon for clickable links
    term.loadAddon(new WebLinksAddon());

    term.open(terminalRef.current);


    // Display welcome message
    term.write(
      "\r\n\x1B[1;32m➜\x1B[0m Welcome to the terminal! \r\n\x1B[1;36m$\x1B[0m "
    );

    // Handle key input
    term.onKey((event) => {
      const ev = event.domEvent;

      // Handle backspace
      if (ev.key === "Backspace") {
        if (commandBuffer.length > 0) {
          setCommandBuffer(commandBuffer.slice(0, -1));
          term.write("\b \b");
        }
        return;
      }

      // Handle Enter key - execute command
      if (ev.key === "Enter") {
        if (commandBuffer.trim()) {
          executeCommand(commandBuffer.trim(), term);
        } else {
          // Just show a new prompt for empty commands
          term.write("\r\n\x1B[1;36m$\x1B[0m ");
        }
        setCommandBuffer("");
        return;
      }

      // Handle normal character input
      if (ev.key.length === 1) {
        setCommandBuffer(commandBuffer + ev.key);
        term.write(ev.key);
      }
    });

    setTerminal(term);



    return () => {
      term.dispose();
    };
  }, [commandBuffer, projectId]);

  // Function to execute command in the container
  const executeCommand = async (command: string, term: Terminal) => {
    term.write("\r\n");
    term.write("Executing command...\r\n");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/container/console`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ command }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        term.write(
          `\x1B[1;31mError: ${data.error || "Failed to execute command"
          }\x1B[0m\r\n`
        );
      } else {
        // Display command output
        if (data.stdout) {
          term.write(data.stdout);
          if (!data.stdout.endsWith("\n")) {
            term.write("\r\n");
          }
        }

        if (data.stderr) {
          term.write(`\x1B[1;31m${data.stderr}\x1B[0m`);
          if (!data.stderr.endsWith("\n")) {
            term.write("\r\n");
          }
        }
      }
    } catch (error) {
      term.write(
        `\x1B[1;31mError: ${error instanceof Error ? error.message : "Unknown error"
        }\x1B[0m\r\n`
      );
    }

    // Show prompt again
    term.write("\x1B[1;36m$\x1B[0m ");
  };

  return (
    <div className="h-64 w-full rounded-md border border-neutral-800 bg-neutral-900 overflow-hidden">
      <div className="flex h-9 items-center justify-between border-b border-neutral-800 px-4">
        <div className="text-sm font-medium text-neutral-200">Terminal</div>
      </div>
      <div ref={terminalRef} className="h-full" id="terminal"></div>;
    </div>
  );
}
