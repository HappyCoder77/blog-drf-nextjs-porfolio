"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_username: string;
}

const PostManager: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const fetchUserPosts = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await api.get("/posts/");

      const userPosts = response.data.filter(
        (post: Post) => post.author_username === user?.username
      );
      setPosts(userPosts);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError("Failed to load your posts. Session may have expired.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const openModal = (post: Post | null = null) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPost(null);
  };

  const handleSave = async (data: { title: string; content: string }) => {
    setError(null);

    try {
      if (currentPost) {
        await api.patch(`/posts/${currentPost.id}/`, data);
      } else {
        await api.post(`/posts/`, data);
      }

      closeModal();
      fetchUserPosts();
    } catch (err) {
      console.error("Error saving post:", err);
      setError("Failed to save post. Check form data.");
    }
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/posts/${postId}/`);
        fetchUserPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Failed to delete post.");
      }
    }
  };

  const PostForm = ({
    post,
    onSave,
    onClose,
  }: {
    post: Post | null;
    onSave: (data: { title: string; content: string }) => void;
    onClose: () => void;
  }) => {
    const [title, setTitle] = useState(post?.title || "");
    const [content, setContent] = useState(post?.content || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ title, content });
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
          <h2 className="text-2xl  text-gray-900 font-bold mb-4">
            {post ? "Edit Post" : "Create New Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full p-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <p className="text-center text-lg text-indigo-600">
        Loading your content...
      </p>
    );
  if (error) return <p className="text-center text-lg text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Posts</h2>
        <button
          onClick={() => openModal(null)}
          className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-150"
        >
          + Create New Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">
            You haven&apost created any posts yet.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg text-gray-950 font-semibold">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Last Updated: {new Date(post.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => openModal(post)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <PostForm post={currentPost} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
};

export default PostManager;
