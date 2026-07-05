import React from "react";
import "./hero.css";
import Post from "../post/Post";
import Share from "../share/Share";

function Hero() {
  return (
    <div className="hero">
      <Share />
      <Post />
    </div>
  );
}

export default Hero;
