import React, { useState } from "react";
import axios from "axios";
import "./style.css"; 

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [main_content, setMainContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString(); // get current date as ISO string
    // Add count field with a value of 0 to the request payload
    const payload = {
      title: title,
      tags: tags,
      main_content: main_content,
      date: currentDate,
      count: 0
    };
    await axios.post("http://localhost:4000/posts", payload);
    setTitle("");
    setTags("");
    setMainContent("");
  };

  return (
    <div className="post-create">
      <h2>Create Post</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="main_content">Content</label>
          <textarea
            id="main_content"
            value={main_content}
            onChange={(e) => setMainContent(e.target.value)}
            rows="18"
            className="form-control"
          />
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
