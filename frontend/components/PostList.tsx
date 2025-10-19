"use client";

import React, { useState, useEffect } from "react";
import { api } from "../utils/api";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_username: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts/");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching Posts", error);
        setError("Failed to load posts. Please check API connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-lg text-indigo-600">Loading posts...</p>
    );
  }

  if (error) {
    return <p className="text-center text-lg text-red-600">{error}</p>;
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
        Latest Posts
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">
              {post.title}
            </h3>
            <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
            <div className="text-sm text-gray-500 flex justify-between">
              <span className="font-medium">
                Author: {post.author_username}
              </span>
              <span>
                Published: {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
