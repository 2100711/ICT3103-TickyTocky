import React from "react";
import "../styles/home.css";
import Navbar from "./navbar";

const Home = () => {
  return (
    <div className="home">
      <div className="div">
        {/* <div className="navbar">
          <div className="logo" alt="" />
          <div className="text-wrapper">Catalogue</div>
          <div className="text-wrapper-2">Auction</div>
          <div className="text-wrapper-3">Get In Touch</div>
          <div className="text-wrapper-4">Discover</div>
          <img className="img" alt="" src="image-14.png" />
        </div> */}
        <Navbar />
        <img className="carousel" alt="" src="image-1.png" />
        <p className="quote">
          “You can’t turn back the clock. But you can wind it up again.”
        </p>
        <img className="products" alt="" />
        <div className="footer">
          <div className="footer-text">COPYRIGHT © 2023 TickyTocky</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
