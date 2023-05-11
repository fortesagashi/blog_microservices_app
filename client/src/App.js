import React, { useState } from "react";
import PostList from "./PostList";
import "./style.css";

const App = () => {
  const [message, setMessage] = useState("");
  return (
    <div className="app-container">
  
        <PostList setMessage={setMessage} />
        
      {message && <p>{message}</p>}
      
    </div>
  );
};

export default App;