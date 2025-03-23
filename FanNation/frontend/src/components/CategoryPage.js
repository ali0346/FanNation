import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch follow status and threads
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          setError('Please log in to follow categories.');
          setLoading(false);
          return;
        }

        // Check if user is following this category
        const followResponse = await fetch(`http://localhost:8080/api/follow/status/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (followResponse.ok) {
          const following = await followResponse.json();
          setIsFollowing(following);

          // If following, fetch threads
          if (following) {
            const threadsResponse = await fetch(`http://localhost:8080/api/threads/category/${categoryId}`, {
              headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
              },
            });
            if (threadsResponse.ok) {
              const threadsData = await threadsResponse.json();
              setThreads(threadsData);
            } else {
              setError('Failed to load threads.');
            }
          }
        } else {
          setError('Failed to check follow status.');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowStatus();
  }, [categoryId]);

  const handleFollowToggle = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        setError('Please log in to follow/unfollow categories.');
        return;
      }

      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:8080/api/follow/category/${categoryId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        if (!isFollowing) {
          // Fetch threads after following
          const threadsResponse = await fetch(`http://localhost:8080/api/threads/category/${categoryId}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
          });
          if (threadsResponse.ok) {
            const threadsData = await threadsResponse.json();
            setThreads(threadsData);
          } else {
            setError('Failed to load threads.');
          }
        } else {
          // Clear threads when unfollowing
          setThreads([]);
        }
      } else {
        setError(`Failed to ${isFollowing ? 'unfollow' : 'follow'} category.`);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="sports-categories-fullscreen">
      <div className="categories-container-full">
        <h2>Discussions for Category {categoryId}</h2>
        <button
          className="follow-btn"
          onClick={handleFollowToggle}
          style={{
            background: isFollowing ? '#ff4444' : '#00bcd4',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '1.1rem',
            fontWeight: '600',
          }}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>

        {isFollowing && (
          <>
            <button
              className="create-thread-btn"
              style={{
                background: '#275360',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '20px',
                fontSize: '1.1rem',
                fontWeight: '600',
              }}
            >
              Create New Discussion Thread
            </button>
            {threads.length > 0 ? (
              <ul className="threads-list">
                {threads.map((thread) => (
                  <li key={thread.id} className="thread-item">
                    <h3>{thread.title}</h3>
                    <p>{thread.content}</p>
                    <div className="thread-actions">
                      <button className="like-btn">Like</button>
                      <button className="dislike-btn">Dislike</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No discussion threads available. Be the first to create one!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;