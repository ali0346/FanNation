import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style.css'; // Assuming this is in the same directory or adjust path

const SportsCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          setError('Failed to load categories.');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="sports-categories-fullscreen">
      <div className="categories-container-full">
        <h2>Sports Categories</h2>
        <ul className="categories-list">
          {categories.map((category) => (
            <li key={category.id} className="category-item">
              <Link to={`/sports/${category.id}`}>{category.name}</Link>
              <p>{category.description || 'Explore this category!'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SportsCategories;