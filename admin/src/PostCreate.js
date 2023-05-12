import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [main_content, setMainContent] = useState("");
  const [image, setImage] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString(); // get current date as ISO string
    // Add count field with a value of 0 to the request payload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("main_content", main_content);
    formData.append("date", currentDate);
    formData.append("count", 0);
    formData.append("image", image);
  
    await axios.post("http://localhost:4000/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  
    setTitle("");
    setTags("");
    setMainContent("");
    setImage(null);
    
    toast.success('Post created!');
  };
  

  return (
    <div className="post-create">
      <h2>Create Post</h2>
      <form onSubmit={onSubmit} encType="multipart/form-data">
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
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="file"
            onChange={(e) => {
              console.log(e.target.files[0]);
              setImage(e.target.files[0]);
            }}
            className="form-control"
          />


        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
