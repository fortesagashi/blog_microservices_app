import React, { useState, useEffect } from "react";
import "./style.css"; 

const PopularTags = (props) => {
const [tags, setTags] = useState(props.tags);

useEffect(() => {
setTags(props.tags);
}, [props.tags]);

return (
    <div className="popular-tags">
        <h4>Popular Tags:</h4>
        <ul className="tags-list">
            {tags.map((tag) => (
                <li className="tag" key={tag}>
                {tag}
                </li>
            ))}
        </ul>
        {tags.map((tag) => {
        console.log("tags:", tags);
        return null; 
        })}
    </div>
    );
};

export default PopularTags;