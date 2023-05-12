import React, { useState, useEffect } from "react";
import CommentList from "./CommentList";
import axios from "axios";
import PopularTags from "./PopularTags";
import PostCreate from "./PostCreate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Cookies from 'js-cookie';

const PostList = ({}) => {
  const POSTS_PER_PAGE = 3;
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [popularTags, setPopularTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");
    const sortedPosts = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setPosts(sortedPosts);
  };
  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(Object.values(posts).length / POSTS_PER_PAGE);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // calculate popular tags based on retrieved posts data
    const tags = Object.values(posts)
      .flatMap((post) => post.tags)
      .reduce((tagCount, tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
        return tagCount;
      }, {});

    const popularTags = Object.entries(tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((tag) => tag[0]);

    setPopularTags(popularTags);

    console.log("popular tags:", popularTags); 
  }, [posts]);

  const handleLogout = () => {
    Cookies.remove('authToken');
    window.location.reload(); // Reload the page to go back to the login page
  };

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  
  const displayedPosts = Object.values(posts)
  .filter((post) => post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
  .slice(startIndex, endIndex)
  .map((post) => {
    const postDate = new Date(post.date).toLocaleString();
    const mainContent = post.main_content.split("\n").slice(0, 5).join("\n");
    console.log(mainContent);
    const imageData = new Uint8Array(post.image.data.data);
    console.log(imageData);
    const blob = new Blob([imageData], { type: post.image.contentType });
    const imageUrl = URL.createObjectURL(blob);
    console.log(imageUrl);
    
    const image = document.createElement('img');
    image.src = imageUrl;
    
    document.body.appendChild(image);
    
      return (
        <div
          className="card"
          style={{ width: "30%", marginBottom: "20px" }}
          key={post.id}
        >
          <div className="card-body">
            <img src={imageUrl} alt="image" style={{ width: "100%", height: "150px", marginBottom: "20px"}}/>
            <h3>{post.title}</h3>
            <span style={{ fontSize: "12px", marginLeft: "5px" }}>
            {postDate}</span>
            <p style={{ fontWeight:12, fontSize: "15px" }}>{post.main_content}</p>
            <button className="view_button" onClick={() => handlePostClick(post)}>View Post</button>
            <span className="view_count">
            <FontAwesomeIcon icon={faEye} />
            {` ${post.count}`}
          </span>
          </div>
        </div>
      );
   

    });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };
  
  const handleCreatePostSuccess = () => {
    setShowCreatePost(false);
    fetchPosts();
  };
  
  const handleDeletePost = async (postId) => {
    setShowConfirmModal(true);
    setSelectedPost(postId);
  };
  
  const confirmDelete = async () => {
    await axios.delete(`http://localhost:4000/posts/${selectedPost.id}`);
    fetchPosts();
    setShowConfirmModal(false);
    setSelectedPost(null);
  };
  
  const handleViewPostsClick = () => {
    window.location.href = "/posts";
  };

  return (
    <div className="d-flex flex-row">
      <div className="sidebar">
        <PopularTags tags={popularTags} />
        <button onClick={handleCreatePost} className="sidebar-button" >
          Create Post
        </button> <br/>
        <button onClick={handleViewPostsClick} className="sidebar-button" >
          View Posts
        </button><br/>
        <button
          onClick={handleLogout}
          style={{ marginTop: "470px", backgroundColor: "#B81030", marginLeft:"60px"}}
        >
          Logout
        </button>
      </div>
      <div className="content">
        {showCreatePost ? (
          <PostCreate onCreatePost={handleCreatePostSuccess} />

        ) : (
          <>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by post tag"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button className="search-btn">Search</button>
            </div>
            {selectedPost ? (
              <div className="post-create">
                <h2>{selectedPost.title}</h2>
                <p>{selectedPost.main_content}</p>
                <CommentList postId={selectedPost.id} />
                <button onClick={() => setSelectedPost(null)}>Go Back</button>
                
                <button onClick={() => handleDeletePost(selectedPost)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <Modal
                  isOpen={showConfirmModal}
                  onRequestClose={() => setShowConfirmModal(false)}
                  contentLabel="Confirm Delete"
                >
                  <h2>Are you sure you want to delete this post?</h2>
                  <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
                  <button onClick={confirmDelete}>Delete</button>
                </Modal>



              </div>
            ) : (
              <>
                <div className="d-flex flex-row flex-wrap justify-content-between">
                  {displayedPosts}
                </div>
                <div className="pagination">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};  

export default PostList;
