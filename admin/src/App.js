import React, { useState } from "react";
import PostList from "./PostList";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";

const App = () => {
  const [message, setMessage] = useState("");
  return (
    <div>
    <ToastContainer />
      <div className="app-container">
    
          <PostList setMessage={setMessage} />
          
        {message && <p>{message}</p>}
        
      </div>
    </div>
  );
};

export default App;
