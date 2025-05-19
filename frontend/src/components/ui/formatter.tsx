"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

interface CodeFormatterProps {
  code: string;
  setCode: (value: string) => void;
  formattedCode: string;
  setFormattedCode: (value: string) => void;
}

export default function CodeFormatter({
  code,
  setCode,
  formattedCode,
  setFormattedCode,
}: CodeFormatterProps) {
  const [loading, setLoading] = useState(false);

  const handleFormatCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/formatter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }), // ❌ Removed "language"
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setFormattedCode(result.formatted_code || "Formatting failed.");
      } else {
        setFormattedCode("Failed to format code.");
      }
    } catch (error) {
      console.error("Error  formatting code:", error); // ✅ Logs the error
      setLoading(false);
      setFormattedCode("Error occurred while formatting code.");
    }
  };

  const handleClearCode = () => setCode("");
  const handleCopyCode = async () => {
    if (formattedCode) {
      await navigator.clipboard.writeText(formattedCode);
      alert("Formatted code copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white rounded flex flex-col">
      {/* Top - Left and Right Panels */}
      <div className="flex flex-1">
        {/* Left - Code Input */}
        <div className="w-1/2 p-4 bg-gray-800 shadow-md rounded-lg m-2 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Input Your Code Here</h2>
            <Button
              className="bg-gray-700 hover:bg-gray-600 text-white shadow-md rounded"
              onClick={handleClearCode}
            >
              Clear Code
            </Button>
          </div>

          <Editor
            height="85vh"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            className="border border-gray-700 rounded shadow-inner"
          />

          <Button
            className="mt-4 w-full bg-blue-700 hover:bg-blue-600 text-white shadow-md rounded"
            onClick={handleFormatCode}
            disabled={loading}
          >
            {loading ? "Formatting..." : "Format Code"}
          </Button>
        </div>

        <div className="w-0.5 bg-gray-600"></div>

        {/* Right - Formatted Code Output */}
        <div className="w-1/2 p-4 bg-gray-800 shadow-md rounded-lg m-2 overflow-y-auto relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Formatted Code</h2>
            <Button
              className="bg-gray-700 hover:bg-gray-600 text-white shadow-md rounded"
              onClick={handleCopyCode}
            >
              <Copy className="mr-2" size={16} />
              Copy Code
            </Button>
          </div>

          {formattedCode && (
            <div className="mt-4 relative bg-gray-700 p-2 rounded-lg shadow-inner">
              <div className="rounded-lg min-h-[90vh] overflow-hidden">
                <Editor
                  value={formattedCode}
                  theme="vs-dark"
                  options={{ readOnly: true }}
                  className="border border-gray-600 min-h-[90vh] rounded-lg"
                  height="auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
