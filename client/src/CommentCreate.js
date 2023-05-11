import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import './style.css'; 

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
    }
  }, []);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content, email });
    setContent('');
    setEmail(email);
    console.log(email);
    window.location.reload();
  };

  return (
    <div className="comment-create">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Write a comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
          <button className="comment-create">Comment</button>
        </div>
      </form>
    </div>
  );
};

export default CommentCreate;
