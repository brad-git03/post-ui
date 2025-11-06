import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/facebook/posts';

const EditPostForm = ({ post, onUpdateSuccess, onCancelEdit }) => {
    // Initialize form state with the current post's content and imageUrl
    const [formData, setFormData] = useState({
        content: post.content,
        imageUrl: post.imageUrl || '' // Use empty string if imageUrl is null
    });
    
    // Note: Author is intentionally not editable in this simple form.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.content) {
            alert("Post content cannot be empty!");
            return;
        }

        try {
            // Send a PUT request to the specific post ID
            const response = await axios.put(`${API_URL}/${post.id}`, {
                content: formData.content,
                imageUrl: formData.imageUrl
            });
            
            // Pass the updated post object back to the parent component
            onUpdateSuccess(response.data);

        } catch (error) {
            console.error("Error updating post:", error.response ? error.response.data : error.message);
            alert("Failed to update post. Check console for details.");
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
                ></textarea>
                <input
                    type="url"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
                <div className="edit-actions">
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button type="button" className="cancel-btn" onClick={onCancelEdit}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditPostForm;