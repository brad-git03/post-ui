import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://post-api-tagm.onrender.com/api/facebook/posts';

const EditPostForm = ({ post, onUpdateSuccess, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    content: post.content,
    imageUrl: post.imageUrl || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.content || formData.content.trim() === '') {
      alert('Post content cannot be empty!');
      return;
    }

    // Build payload - include existing post fields in case the API expects them
    // (Adjust this to match your backend's expected shape)
    const payload = {
      ...post,
      content: formData.content,
      imageUrl: formData.imageUrl
    };

    // Log what we're about to send
    console.log('PUT payload for post id', post.id, payload);

    setIsSaving(true);
    try {
      const response = await axios.put(`${API_URL}/${post.id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Update response:', response.data);
      onUpdateSuccess(response.data);

    } catch (error) {
      // Log as much info as possible to help debug the server-side 500
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        console.error('Error response data:', error.response.data);
      } else {
        console.error('Error message:', error.message);
      }

      // User-friendly alert
      const serverMsg = error.response && error.response.data
        ? JSON.stringify(error.response.data)
        : error.message;
      alert('Failed to update post. Server returned: ' + serverMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-form-container">
      <h4>Editing Post by {post.author}</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="4"
          required
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <div className="edit-actions">
          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancelEdit} disabled={isSaving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm;
