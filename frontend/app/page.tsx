"use client";

import { useState, useEffect } from "react";

interface ReelIdea {
  id?: string;
  idea: string;
  hooks: string[];
  caption_short: string;
  caption_long: string;
  hashtags: string[];
  niche?: string;
  created_at?: string;
}

export default function Home() {
  const [niche, setNiche] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<ReelIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<ReelIdea[]>([]);

  // Debug log for savedIdeas changes
  useEffect(() => {
    console.log("savedIdeas updated:", savedIdeas);
  }, [savedIdeas]);

  // Fetch saved ideas on component mount
  useEffect(() => {
    const fetchSavedIdeas = async () => {
      try {
        console.log("Fetching saved ideas...");
        const response = await fetch("http://localhost:8000/api/get-saved-ideas");
        if (!response.ok) {
          throw new Error("Failed to fetch saved ideas");
        }
        const data = await response.json();
        console.log("API Response:", data);
        if (data && data.length > 0) {
          console.log("First idea from API:", data[0]);
        }
        setSavedIdeas(data);
      } catch (err) {
        console.error("Error fetching saved ideas:", err);
      }
    };

    fetchSavedIdeas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    console.log("Deleting idea with ID:", id);
    const confirmDelete = window.confirm("Are you sure you want to delete this idea?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/delete-idea/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete idea');
      }

      console.log("Idea deleted successfully, updating UI...");
      setSavedIdeas(prev => {
        const updated = prev.filter(idea => idea.id !== id);
        console.log("Updated savedIdeas after deletion:", updated);
        return updated;
      });
      setIdeas(prev => prev.filter(idea => idea.id !== id));
      
      alert("Idea deleted successfully");
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete idea');
    }
  };

  // Rest of your component code remains the same until the return statement

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Debug Info Panel */}
      <div className="fixed bottom-4 right-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg z-50 max-w-xs">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Total Ideas: {[...savedIdeas, ...ideas].length}</p>
        <p>Saved Ideas: {savedIdeas.length}</p>
        <p>Generated Ideas: {ideas.length}</p>
        <p>Current Niche: {niche || 'None'}</p>
      </div>

      <div className="max-w-6xl mx-auto">
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

        {/* Rest of your JSX remains the same until the delete button section */}

        {[...savedIdeas, ...ideas].map((idea, index) => (
          <div
            key={idea.id || `generated-${index}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col mb-6"
          >
            {/* Your existing card content */}

            <div className="mt-4 pt-4 border-t border-gray-100">
              {/* Debug info - temporary */}
              <div className="text-xs text-gray-500 mb-2">
                ID: {idea.id || 'no-id'} | Type: {idea.id ? 'saved' : 'unsaved'}
              </div>
              
              {/* Test: Always show delete button for debugging */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (idea.id) {
                    handleDelete(idea.id);
                  } else {
                    console.log("No ID found for idea:", idea);
                  }
                }}
                className={`w-full px-4 py-2 rounded-md transition-colors ${
                  idea.id 
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {idea.id ? "Delete Idea" : "Not Saved (No ID)"}
              </button>
            </div>
          </div>
        ))}

        {/* Rest of your JSX */}
      </div>
    </main>
  );
}