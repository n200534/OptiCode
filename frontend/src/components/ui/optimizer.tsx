"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ReactNode } from "react";

interface CodeOptimizerProps {
  code: string;
  setCode: (value: string) => void;
  optimizedCode: string;
  setOptimizedCode: (value: string) => void;
  profilingResults: string;
  setProfilingResults: (value: string) => void;
}
type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function CodeOptimizer({
  code,
  setCode,
  optimizedCode,
  setOptimizedCode,
  profilingResults,
  setProfilingResults,
}: CodeOptimizerProps) {
  const [loading, setLoading] = useState(false);

  const handleOptimizeCode = async () => {
    setLoading(true);
    try {
      console.log("Sending code for optimization:", { code });

      const response = await fetch("http://localhost:8000/optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setOptimizedCode(result.optimized_code || "Optimization failed.");
        setProfilingResults(
          result.profiling_results?.analysis || "No profiling results."
        );
      } else {
        setOptimizedCode("Failed to optimize code.");
        setProfilingResults("Failed to analyze performance.");
      }
    } catch (error) {
      console.error("Error optimizing code:", error);
      setLoading(false);
      setOptimizedCode("Error occurred while optimizing code.");
      setProfilingResults("Error occurred during performance analysis.");
    }
  };

  const handleClearCode = () => setCode("");
  const handleCopyCode = async () => {
    if (optimizedCode) {
      await navigator.clipboard.writeText(optimizedCode);
      alert("Optimized code copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white rounded flex flex-col">
      <div className="flex flex-1">
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
            onClick={handleOptimizeCode}
            disabled={loading}
          >
            {loading ? "Optimizing..." : "Optimize Code"}
          </Button>
        </div>

        <div className="w-0.5 bg-gray-600"></div>

        <div className="w-1/2 p-4 bg-gray-800 shadow-md rounded-lg m-2 overflow-y-auto relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Optimized Code</h2>
            <Button
              className="bg-gray-700 hover:bg-gray-600 text-white shadow-md rounded"
              onClick={handleCopyCode}
            >
              <Copy className="mr-2" size={16} /> Copy Code
            </Button>
          </div>

          {optimizedCode && (
            <div className="mt-4 relative bg-gray-700 p-2 rounded-lg shadow-inner">
              <div className="rounded-lg min-h-[55vh] overflow-hidden">
                <Editor
                  value={optimizedCode}
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

      {profilingResults && (
        <div className="w-full p-4 bg-gray-800 shadow-md rounded-lg m-2 mt-4">
          <h2 className="text-xl font-bold">Performance Analysis</h2>

          <div className="mt-4 relative bg-gray-700 p-2 rounded-lg shadow-inner">
            <h3 className="text-lg font-bold mb-2">Analysis:</h3>

            <ReactMarkdown
              className="prose prose-invert mt-2"
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code: ({
                  inline,
                  className,
                  children,
                  ...props
                }: CodeProps) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={
                        vscDarkPlus as { [key: string]: React.CSSProperties }
                      }
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {profilingResults || "No profiling results yet."}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
