import React, { useState } from 'react';
import axios from 'axios';

const UserContent = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState('');  


  const handleFileChange = (e) => setImage(e.target.files[0]);


  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('content', content);
    formData.append('image', image);

    try {

      const response = await axios.post('http://localhost:5000/user-content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);  
      setError('');  
      setTitle('');
      setAuthor('');
      setContent('');
      setImage(null);

    } catch (error) {
      console.error('Error submitting content for approval:', error);
      setError('Error submitting content. Please try again.');  // Display error message
      setMessage('');  // Clear any previous success message
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Submit Your Content</h1>

      {/* Display Success or Error Message */}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Author</label>
          <input 
            type="text" 
            placeholder="Author" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <textarea 
            placeholder="Content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded" 
            required 
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Upload Image</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="w-full p-2" 
            required 
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
          Submit for Approval
        </button>
      </form>
    </div>
  );
};

export default UserContent;
