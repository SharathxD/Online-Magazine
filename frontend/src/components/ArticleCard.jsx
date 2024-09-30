import React from 'react';

const ArticleCard = ({ article }) => {

  const imageSrc = `src/${article.imageUrl}`; 
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={imageSrc}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
        <p className="text-sm text-gray-600">By {article.author}</p>
        <p className="mt-2 text-gray-800">{article.content.substring(0, 100)}...</p>
        <a href="#" className="text-blue-500 hover:underline mt-2 inline-block">Read More</a>
      </div>
    </div>
  );
};

export default ArticleCard;
