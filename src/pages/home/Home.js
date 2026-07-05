import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Hero from "../../components/hero/Hero";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-body">
        <aside className="home-sidebar">
          <Sidebar />
        </aside>
        <main className="home-main">
          <Hero />
        </main>
        <aside className="home-rightbar">
          <Rightbar />
        </aside>
      </div>
    </div>
  );
}

export default Home;
