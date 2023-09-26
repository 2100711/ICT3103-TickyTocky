import React from "react";
import "../styles/dashboard.css";

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="div">
        <div className="div-2">
          <div className="div-2">
            <div className="navbar">
              <div className="text-wrapper">Catalogue</div>
              <div className="text-wrapper-2">Auction</div>
              <div className="text-wrapper-3">Get In Touch</div>
              <div className="text-wrapper-4">Discover</div>
              <img className="image" alt="" src="image-17.png" />
            </div>
          </div>
          <img className="img" alt="" src="image-14.png" />
        </div>
        <div className="group">
          <div className="overlap">
            <div className="text-wrapper-5">COPYRIGHT © 2023 TickyTocky</div>
          </div>
        </div>
        <img className="image-2" alt="" src="image-18.png" />
        <img className="image-3" alt="" src="image-19.png" />
        <div className="overlap-group">
          <div className="text-wrapper-6">Dashboard</div>
          <div className="overlap-2">
            <div className="text-wrapper-7">Account</div>
            <div className="text-wrapper-8">Account</div>
          </div>
          <div className="text-wrapper-9">Placeholder</div>
          <div className="text-wrapper-10">Log Out</div>
          <img className="line" alt="Line" src="line-8.svg" />
          <img className="line-2" alt="Line" src="line-9.svg" />
        </div>
        <div className="overlap-wrapper">
          <div className="overlap-3">
            <div className="overlap-4">
              <div className="group-2">
                <div className="group-3">
                  <div className="text-wrapper-11">Brand : Something</div>
                  <div className="text-wrapper-12">
                    Model : SomethingSomething
                  </div>
                  <img className="pngegg" alt="Pngegg" src="pngegg-2.svg" />
                </div>
                <img className="line-3" alt="Line" src="line-11.svg" />
                <div className="group-4">
                  <div className="text-wrapper-13">Brand : Something</div>
                  <div className="text-wrapper-14">
                    Model : SomethingSomething
                  </div>
                  <img className="pngegg-2" alt="Pngegg" src="pngegg-2-2.svg" />
                </div>
                <img className="line-4" alt="Line" src="line-12.svg" />
                <div className="group-5">
                  <div className="text-wrapper-11">Brand : Something</div>
                  <div className="text-wrapper-12">
                    Model : SomethingSomething
                  </div>
                  <img className="pngegg" alt="Pngegg" src="image.svg" />
                </div>
              </div>
              <div className="text-wrapper-15">Past Purchases</div>
            </div>
            <div className="text-wrapper-16">More</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
