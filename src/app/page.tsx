"use client";

import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");

  const handleClick = async (action: string) => {
    if (!jobDescription) {
      setOutput("⚠️ Please paste a job description first.");
      return;
    }

    setOutput("⏳ Thinking...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, action }),
      });

      const data = await res.json();
      if (res.ok) {
        setOutput(data.result);
      } else {
        setOutput("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("Frontend error:", error);
      setOutput("❌ Something went wrong. Check console.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">JobHacker AI</h1>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste your job description here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg mb-4"
        />

        <div className="flex flex-wrap gap-4 mb-4 justify-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleClick("Tailor Resume")}
          >
            Tailor Resume
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => handleClick("Generate Cover Letter")}
          >
            Generate Cover Letter
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => handleClick("Analyze Job Description")}
          >
            Analyze JD
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow-md min-h-[120px]">
          {output || "🧠 Output will appear here..."}
        </div>
      </div>
    </main>
  );
}
