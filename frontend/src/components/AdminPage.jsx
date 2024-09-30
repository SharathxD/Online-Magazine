import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [pendingArticles, setPendingArticles] = useState([]);  // State for pending approval articles

  // Fetch pending articles on component mount
  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-articles');
        setPendingArticles(response.data.articles);  // Store articles that are pending approval
      } catch (error) {
        console.error('Error fetching pending articles:', error);
      }
    };

    fetchPendingArticles();
  }, []);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('content', content);
    formData.append('image', image);

    try {
      // Direct post request without token
      await axios.post('http://localhost:5000/articles', formData);
      alert('Article submitted successfully!');
      setTitle('');
      setAuthor('');
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Error submitting article.');
    }
  };

  const handleApprove = async (articleId) => {
    try {
      // Send approve request to the backend
      await axios.post(`http://localhost:5000/approve-article/${articleId}`);
      alert('Article approved successfully!');

      // Update the pendingArticles state to remove the approved article
      setPendingArticles(pendingArticles.filter(article => article._id !== articleId));
    } catch (error) {
      console.error('Error approving article:', error);
      alert('Error approving article.');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      {/* Form for adding a new article */}
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
          Submit
        </button>
      </form>

      {/* Section for pending approval articles */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Admin Approval</h2>

        {/* Display pending articles */}
        {pendingArticles.length > 0 ? (
          <div>
            {pendingArticles.map((article) => (
              <div key={article._id} className="mb-6 p-4 border border-gray-300 rounded">
                <h3 className="text-2xl font-bold">{article.title}</h3>
                <p className="text-sm text-gray-600">Author: {article.author}</p>
                <p>{article.content}</p>
                {article.image_url && (
                  <img 
                    src={`http://localhost:5000/${article.image_url}`} 
                    alt="Article" 
                    className="mt-4 w-64 h-64 object-cover"
                  />
                )}
                <button
                  onClick={() => handleApprove(article._id)}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No articles pending approval.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
