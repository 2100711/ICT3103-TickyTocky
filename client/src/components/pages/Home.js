import React, { useState } from "react";
import { Input, notification } from "antd";
import "../styles/Home.css";

export const Home = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/certs/" + searchInput, {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response);
      response.json().then(() => {
        if (response.status === 200) {
          notification.success({
            message: "Certification Found",
            description: "Certificate is valid",
            duration: 5,
          });
        } else {
          notification.error({
            message: "Certification Not Found",
            description: "Certificate is invalid",
            duration: 5,
          });
        }
      });
    });
  };

  return (
    <div className="home">
      <div className="search-bar">
        <Input
          placeholder="Search..."
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
        />
      </div>
    </div>
  );
};
