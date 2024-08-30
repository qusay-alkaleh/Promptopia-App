"use client";

import React, { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data?.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");

      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    e.preventDefault();

    setSearchText(e.target.value);
  };
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          required
          type="text"
          value={searchText}
          className="search_input peer"
          onChange={handleSearchChange}
          placeholder="Search for a tag or a username"
        />
      </form>

      <PromptCardList data={posts} handleTagClick={() => {}} />
    </section>
  );
};

export default Feed;
