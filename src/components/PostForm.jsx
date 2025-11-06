import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ onPostCreated }) => {
    const [formData, setFormData] = useState({
        author: '',
        content: '',
        imageUrl: ''
    });
    
    const API_URL = 'https://post-api-tagm.onrender.com/api/facebook/posts';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.author || !formData.content) {
            alert("Author and content are required!");
            return;
        }

        try {
            const response = await axios.post(API_URL, formData);
            
            setFormData({ author: '', content: '', imageUrl: '' });
            
            // Update the main list immediately
            onPostCreated(response.data);

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post.");
        }
    };

    return (
        <div className="post-form-card">
            <h3>What's on your mind?</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="author"
                    placeholder="Your Name / Author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="content"
                    placeholder="Write your post content here..."
                    value={formData.content}
                    onChange={handleChange}
                    rows="4"
                    required
                ></textarea>
                <input
                    type="url"
                    name="imageUrl"
                    placeholder="Optional Image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
                <button type="submit">Post to Feed</button>
            </form>
        </div>
    );
};

export default PostForm;