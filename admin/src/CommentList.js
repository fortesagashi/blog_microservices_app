import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import './style.css'; 

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchData = async () => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  
  const handleDeleteComment = async () => {
    await axios.delete(`http://localhost:4001/comments/${deleteCommentId}`);
    setDeleteCommentId(null);
    setShowConfirmModal(false);
    fetchData();
  };

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
          <button onClick={() => {
            setDeleteCommentId(comment._id);
            setShowConfirmModal(true);
          }}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <div>{comment.content}</div>
      </li>
    );
  });

  return (
    <div>
      {comments.length > 0 ? (
        <ul className="comment-list">
          {renderedComments}
        </ul>
      ) : (
        <ul className="comment-list">No comments yet</ul>
      )}
      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        contentLabel="Confirm Delete Comment"
      >
        <h2>Confirm Delete Comment</h2>
        <p>Are you sure you want to delete this comment?</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
          <button onClick={handleDeleteComment}>Delete</button>
        </div>
      </Modal>
    </div>
  );
  
};

export default CommentList;
