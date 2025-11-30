"use client";

import { useState } from "react";

interface ReelIdea {
  idea: string;
  hooks: string[];
  caption_short: string;
  caption_long: string;
  hashtags: string[];
}

export default function Home() {
  const [niche, setNiche] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<ReelIdea[]>([]);

  const fetchIdeas = async (niche: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/generate-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ niche }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ideas");
      }

      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) {
      setError("Please enter a niche");
      return;
    }
    fetchIdeas(niche);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Instagram Reel Planner
          </h1>
          <a 
            href="/saved-ideas" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Saved Ideas
          </a>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
          <div className="flex gap-2">
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Enter your niche..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-green-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate Ideas"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 text-left">{error}</p>
          )}
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {idea.idea}
                </h3>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Hooks:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {idea.hooks.map((hook, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {hook}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Short Caption:
                  </h4>
                  <p className="text-sm text-gray-600">{idea.caption_short}</p>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Long Caption:
                  </h4>
                  <p className="text-sm text-gray-600">{idea.caption_long}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Hashtags:
                  </h4>
                  <p className="text-sm text-indigo-600 break-words">
                    {idea.hashtags.map((tag) => `#${tag}`).join(" ")}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        "http://localhost:8000/api/save-idea",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            idea: idea.idea,
                            hooks: idea.hooks,
                            caption_short: idea.caption_short,
                            caption_long: idea.caption_long,
                            hashtags: idea.hashtags,
                            niche: niche,
                          }),
                        }
                      );

                      if (!res.ok) {
                        throw new Error("Failed to save idea");
                      }

                      alert("Idea saved!");
                    } catch (err) {
                      alert("Error saving idea");
                    }
                  }}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Idea
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Enter a niche and click "Generate Ideas" to get started
            </p>
          </div>
        )}
      </div>
    </main>
  );
}