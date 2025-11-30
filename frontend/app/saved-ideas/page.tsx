"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiClock, FiTrash2 } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

interface SavedIdea {
  id: string;
  idea: string;
  hooks: string[];
  caption_short: string;
  caption_long: string;
  hashtags: string[];
  niche: string;
  created_at: string;
}

export default function SavedIdeasPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchSavedIdeas = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-saved-ideas");
      if (!response.ok) {
        throw new Error("Failed to fetch saved ideas");
      }
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedIdeas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("No ID provided for deletion");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this idea?");
    if (!confirmDelete) return;

    setIsDeleting(id);
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

      // Remove the deleted idea from the UI
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete idea');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Generator
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Saved Ideas</h1>
          <div></div>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't saved any ideas yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(idea.id)}
                  disabled={isDeleting === idea.id}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Delete idea"
                >
                  {isDeleting === idea.id ? (
                    <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <FiTrash2 className="h-5 w-5" />
                  )}
                </button>

                <div className="pr-6"> {/* Add padding to prevent text overlap with delete button */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{idea.idea}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {idea.niche}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Hooks:</h4>
                    <div className="flex flex-wrap gap-1">
                      {idea.hooks.map((hook, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {hook}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Short Caption:</h4>
                    <p className="text-sm text-gray-600">{idea.caption_short}</p>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Long Caption:</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{idea.caption_long}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Hashtags:</h4>
                    <p className="text-sm text-indigo-600 break-words">
                      {idea.hashtags.map((tag) => `#${tag}`).join(" ")}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span className="flex items-center">
                      <FiClock className="mr-1 h-3.5 w-3.5" />
                      {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}