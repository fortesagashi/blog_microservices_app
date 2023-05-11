import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css'; 

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const renderedComments = comments.map((comment) => {
    const commentDate = new Date(comment.time).toLocaleString();
    return (
      <li key={comment._id}>
        <div>
          <span style={{ fontWeight: "bold" }}>
            {comment.email}
          </span>
          <span style={{ fontSize: "12px", marginLeft: "5px" }}>
            {commentDate}
          </span>
        </div>
        <div>{comment.content}</div>
      </li>
    );
  });

  return (
    <div>
      {comments.length > 0 ? (
        <ul className="comment-list">{renderedComments}</ul>
      ) : (
        <ul className="comment-list">No comments yet</ul>
      )}
    </div>
  );
};

export default CommentList;
