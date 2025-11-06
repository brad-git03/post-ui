import React, { useState, useEffect } from 'react';
import PostForm from './components/PostForm';
import EditPostForm from './components/EditPostForm';
import './App.css';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://post-api-tagm.onrender.com/api/facebook/posts';

  const fetchPosts = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(response => {
        // Initialize posts with an isEditing flag set to false
        const initialPosts = response.data.map(post => ({
          ...post,
          isEditing: false
        }));
        setPosts(initialPosts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    // Ensure createdDateTime exists (fallback to now if backend didn't set it)
    const normalized = {
      ...newPost,
      createdDateTime: newPost.createdDateTime || new Date().toISOString(),
      isEditing: false
    };
    setPosts([normalized, ...posts]);
  };

  // Function to update the posts list after a successful PUT request
  const handlePostUpdated = (updatedPost) => {
    setPosts(
      posts.map(post =>
        post.id === updatedPost.id
          // Merge to avoid losing any fields not returned by server
          ? { ...post, ...updatedPost, isEditing: false }
          : post
      )
    );
  };

  // Function to toggle the edit state for a specific post
  const toggleEdit = (id) => {
    setPosts(
      posts.map(post => {
        if (post.id === id) {
          // Toggle the edit state for the clicked post
          return { ...post, isEditing: !post.isEditing };
        } else {
          // Ensure all other posts are NOT in edit mode
          return { ...post, isEditing: false };
        }
      })
    );
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      setPosts(posts.filter(post => post.id !== id));
      alert(`Post ${id} deleted successfully.`);

    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };


  if (loading) {
    return <h1>Loading Posts...</h1>;
  }

  return (
    <div className="App">
      <h1>Facebook-Style Feed</h1>

      <PostForm onPostCreated={handlePostCreated} />

      <h2>Recent Posts</h2>
      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="post-card">

              {/* Conditional Rendering: Show Edit Form or Show Post Content */}
              {post.isEditing ? (
                <EditPostForm
                  post={post}
                  onUpdateSuccess={handlePostUpdated}
                  onCancelEdit={() => toggleEdit(post.id)}
                />
              ) : (
                <>
                  <h3>{post.content}</h3>
                  {post.imageUrl &&
                    <img
                      src={post.imageUrl}
                      alt="Post visual"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Failed" }}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    />}
                  <p>— Posted by: <strong>{post.author}</strong></p>

                  <div className="timestamp">
                    <div>
                      Created: {post.createdDateTime ? new Date(post.createdDateTime).toLocaleString() : 'Unknown'}
                    </div>

                    {post.modifiedDateTime && post.modifiedDateTime !== post.createdDateTime && (
                      <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                        Edited: {new Date(post.modifiedDateTime).toLocaleString()}
                      </div>
                    )}

                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => toggleEdit(post.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No posts found. Be the first to post!</p>
        )}
      </div>
    </div>
  );
}

export default App;
