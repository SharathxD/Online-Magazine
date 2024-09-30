import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ArticleCard from './ArticleCard'; 
import { Link, useNavigate } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation'; 
const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); 
  const containerRef = useRef(); 
  const navigate = useNavigate();
  const [role, setRole] = useState(''); 
  useScrollAnimation(containerRef); 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();

   
    const storedRole = localStorage.getItem('userRole'); 
    console.log(storedRole)
    if (storedRole) {
      setRole(storedRole);
    } else {
      console.warn('User role not found in localStorage.');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole'); 
    navigate('/login'); 
  };

  const handleAddContent = () => {
    console.log('role in the function',role)
    if (role === 'admin') {
      navigate('/admin'); 
    } else if (role === 'user') {
      navigate('/UserContent'); 
    } else {
      alert('Invalid role!'); 
    }
  };

  return (
    <div ref={containerRef} className="animated-element relative"> {/* Attach the ref to the container */}
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">kamanaBILLU</h1>
        
        {/* Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none bg-blue-500 text-white py-2 px-4 rounded"
          >
            Menu
          </button>
          
          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                onClick={handleAddContent} 
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Add Content
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
