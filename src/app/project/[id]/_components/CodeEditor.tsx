import { useProjectFileStore } from "@/store/projectFileStore";
import Editor from '@monaco-editor/react';
import { FaCode } from "react-icons/fa";

interface CodeEditorProps {
  content: string;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ content, onChange }: CodeEditorProps) {
  const { activeFile } = useProjectFileStore();

  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-400 bg-neutral-900 text-lg">
        Select a file to edit
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-neutral-900 px-4 py-1 border-b border-neutral-800 text-sm text-neutral-200 flex items-center">
        <FaCode className="mr-2 text-neutral-400" />
        {activeFile.name}
      </div>

      <Editor
        value={content}
        language={activeFile.language?.toLowerCase()}
        onChange={onChange}
        theme="vs-dark"
        options={{
          padding: { top: 10, bottom: 10 },
          fontSize: 15,
          fontWeight: "normal",
          fontFamily: "monospace",
          wordWrap: "on",
        }}
        className="flex-1 w-full bg-gray-850 text-gray-100 font-mono text-sm outline-none resize-none overflow-auto"
      />
    </div>
  );
}