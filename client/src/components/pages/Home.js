import React from "react";
import { Input } from "antd";
import "../styles/Home.css"; // Corrected the import statement

export const Home = () => {
  return (
    <div className="home">
      <div className="search-bar">
        <Input placeholder="Search..." className="search-input" allowClear />
      </div>
    </div>
  );
};
