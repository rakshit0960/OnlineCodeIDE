import { useProjectFileStore } from "@/store/projectFileStore";
import Editor from '@monaco-editor/react';
import { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";


type EditorSettings = {
  fontSize: number;
  theme: string;
  wordWrap: "on" | "off" | "wordWrapColumn" | "bounded" | undefined;
  minimap: { enabled: boolean };
  lineNumbers: "on" | "off" | "relative" | "interval" | undefined;
  scrollBeyondLastLine: boolean;
  automaticLayout: true,
  tabSize: number,
  fontFamily: string,
  fontWeight: string,
  padding: { top: number, bottom: number },
}

export default function CodeEditor() {
  const { activeFile, setActiveFile } = useProjectFileStore();
  const [editorContent, setEditorContent] = useState("");
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    fontSize: 15,
    theme: "vs-dark",
    wordWrap: "on",
    minimap: { enabled: false },
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    fontFamily: "monospace",
    fontWeight: "normal",
    padding: { top: 10, bottom: 10 },
  });

  // Load editor settings from localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem('editorSettings');
    if (storedSettings) {
      setEditorSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Update editor content when active file changes
  useEffect(() => {
    if (activeFile?.content !== undefined) {
      setEditorContent(activeFile.content);
    } else {
      setEditorContent("");
    }
  }, [activeFile]);

  const handleEditorChange = (value: string | undefined) => {
    setEditorContent(value || '');
    if (activeFile) {
      setActiveFile({ ...activeFile, content: value || '' });
    }
  };

  // Function to update editor settings
  const updateEditorSettings = (newSettings: Partial<typeof editorSettings>) => {
    localStorage.setItem('editorSettings', JSON.stringify({ ...editorSettings, ...newSettings }));
    setEditorSettings(prev => ({ ...prev, ...newSettings }));
  };

  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-400 bg-neutral-900 text-lg">
        Select a file to edit
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-neutral-900 px-4 py-1 border-b border-neutral-800 text-sm text-neutral-200 flex items-center justify-between">
        <div className="flex items-center">
          <FaCode className="mr-2 text-neutral-400" />
          {activeFile.name}
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="bg-neutral-800 text-neutral-200 text-xs px-2 py-1 rounded border border-neutral-700"
            value={editorSettings.fontSize}
            onChange={(e) => updateEditorSettings({ fontSize: Number(e.target.value) })}
          >
            {[12, 14, 15, 16, 18, 20, 24, 30].map(size => (
              <option key={size} value={size}>Font: {size}px</option>
            ))}
          </select>
          <select
            className="bg-neutral-800 text-neutral-200 text-xs px-2 py-1 rounded border border-neutral-700"
            value={editorSettings.theme}
            onChange={(e) => updateEditorSettings({ theme: e.target.value })}
          >
            <option value="vs-dark">Dark</option>
            <option value="vs-light">Light</option>
            <option value="hc-black">High Contrast Dark</option>
            <option value="hc-light">High Contrast Light</option>
          </select>
        </div>
      </div>

      <Editor
        value={editorContent}
        language={activeFile.language?.toLowerCase()}
        onChange={handleEditorChange}
        theme={editorSettings.theme}
        options={{
          fontSize: editorSettings.fontSize,
          fontWeight: editorSettings.fontWeight,
          fontFamily: editorSettings.fontFamily,
          wordWrap: editorSettings.wordWrap,
          minimap: editorSettings.minimap,
          lineNumbers: editorSettings.lineNumbers,
          scrollBeyondLastLine: editorSettings.scrollBeyondLastLine,
          automaticLayout: editorSettings.automaticLayout,
          tabSize: editorSettings.tabSize,
          padding: editorSettings.padding,
        }}
        className="flex-1 w-full bg-gray-850 text-gray-100 font-mono text-sm outline-none resize-none overflow-auto"
      />
    </div>
  );
}