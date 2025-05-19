"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ReactNode } from "react";

interface CodeExplainerProps {
  code: string;
  setCode: (value: string) => void;
  explanation: string;
  setExplanation: (value: string) => void;
}

type CodeProps = {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function CodeExplainer({
  code,
  setCode,
  explanation,
  setExplanation,
}: CodeExplainerProps) {
  const [loading, setLoading] = useState(false);

  const handleExplainCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/explainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setExplanation(result.explanation || "No explanation provided.");
      } else {
        setExplanation("Failed to explain code.");
      }
    } catch (error) {
      console.error("Error occurred while explaining code:", error);
      setLoading(false);
      setExplanation("Error occurred while explaining code.");
    }
  };

  const handleClearCode = () => setCode("");

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
            onClick={handleExplainCode}
            disabled={loading}
            className="mt-4 w-full bg-blue-700 hover:bg-blue-600 text-white shadow-md rounded"
          >
            {loading ? "Explaining..." : "Explain Code"}
          </Button>
        </div>

        <div className="w-0.5 bg-gray-600"></div>

        <div className="w-1/2 p-4 bg-gray-800 shadow-md rounded-lg m-2 overflow-y-auto relative">
          <h2 className="text-xl font-bold mb-4">Explanation</h2>

          <div className="mt-4 relative bg-gray-700 p-2 rounded-lg shadow-inner">
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
                      {String(children)}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {explanation || "No explanation yet."}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
