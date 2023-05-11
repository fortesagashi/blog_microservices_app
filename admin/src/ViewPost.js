import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentList from "./CommentList";

const ViewPost = ({ match }) => {
  const [post, setPost] = useState({});
  const { postId } = match.params;

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://localhost:4000/posts/${postId}`);
      const date = new Date(res.data.date);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      setPost({ ...res.data, date: formattedDate });
    };
    fetchPost();
  }, [postId]);

  return (
    <div className="post-create">
      <h2>{post.title}</h2>
      <h3>{post.date}</h3>
      <p style={{ fontWeight:12, fontSize: "15px" }}>{post.main_content}</p>
      <CommentList postId={post.id} />
    </div>
  );
};

export default ViewPost;
