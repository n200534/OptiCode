"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CodeChecker from "@/components/ui/code-checker";
import CodeOptimizer from "@/components/ui/optimizer";
import CodeFormatter from "@/components/ui/formatter";
import CodeExplainer from "@/components/ui/explainer";

export default function Home() {
  // Global state for the code editor
  const [code, setCode] = useState(""); // Code input
  const [output, setOutput] = useState(""); // General output
  const [optimizedCode, setOptimizedCode] = useState(""); // Optimized output
  const [correctedCode, setCorrectedCode] = useState(""); // Corrected code output
  const [formattedCode, setFormattedCode] = useState(""); // Formatted code output
  const [explanation, setExplanation] = useState(""); // Explanation output
  const [profilingResults, setProfilingResults] = useState(""); // Performance profiling results

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-16 px-4">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold">Welcome to OptiCode</h1>
        <p className="text-gray-400 mt-2">
          An AI-powered code optimization tool
        </p>
      </div>

      {/* Tab Bar */}
      <Tabs defaultValue="checker" className="w-full max-w-8xl mt-8">
        <TabsList className="flex justify-center gap-4 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 w-full max-w-4xl">
          <TabsTrigger
            value="checker"
            className="px-8 py-3 text-lg rounded-md text-white font-semibold transition-all duration-300 bg-gray-700 hover:bg-opacity-80 focus:ring-2 focus:ring-blue-500 shadow-md"
          >
            Code Checker
          </TabsTrigger>
          <TabsTrigger
            value="optimizer"
            className="px-8 py-3 text-lg rounded-md text-white font-semibold transition-all duration-300 bg-gray-700 hover:bg-opacity-80 focus:ring-2 focus:ring-blue-500 shadow-md"
          >
            Code Optimizer
          </TabsTrigger>
          <TabsTrigger
            value="formatter"
            className="px-8 py-3 text-lg rounded-md text-white font-semibold transition-all duration-300 bg-gray-700 hover:bg-opacity-80 focus:ring-2 focus:ring-blue-500 shadow-md"
          >
            Code Formatter
          </TabsTrigger>
          <TabsTrigger
            value="explainer"
            className="px-8 py-3 text-lg rounded-md text-white font-semibold transition-all duration-300 bg-gray-700 hover:bg-opacity-80 focus:ring-2 focus:ring-blue-500 shadow-md"
          >
            Code Explainer
          </TabsTrigger>
        </TabsList>

        {/* Pass props to each component */}
        <TabsContent value="checker" className="w-full">
          <CodeChecker
            code={code}
            setCode={setCode}
            output={output}
            setOutput={setOutput}
            correctedCode={correctedCode}
            setCorrectedCode={setCorrectedCode}
          />
        </TabsContent>

        <TabsContent value="optimizer" className="w-full">
          <CodeOptimizer
            code={code}
            setCode={setCode}
            optimizedCode={optimizedCode}
            setOptimizedCode={setOptimizedCode}
            profilingResults={profilingResults}
            setProfilingResults={setProfilingResults}
          />
        </TabsContent>

        <TabsContent value="formatter" className="w-full">
          <CodeFormatter
            code={code}
            setCode={setCode}
            formattedCode={formattedCode}
            setFormattedCode={setFormattedCode}
          />
        </TabsContent>

        <TabsContent value="explainer" className="w-full">
          <CodeExplainer
            code={code}
            setCode={setCode}
            explanation={explanation}
            setExplanation={setExplanation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
