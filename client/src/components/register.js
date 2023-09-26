import React from "react";
import "../styles/register.css";

const Register = () => {
  const FNAME = "fname";

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    fetch("http://localhost:3001/users/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [FNAME]: data.get(FNAME),
        lname: data.get("lname"),
        password: data.get("password"),
        email: data.get("email"),
        address: data.get("address"),
      }),
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    });
  };

  return (
    <div className="register">
      <div className="div" />
      <div className="text-wrapper">First Name</div>
      <input type="text" name={FNAME} />
      <div className="text-wrapper">Last Name</div>
      <input type="text" name="lname" />
      <div className="text-wrapper">Password</div>
      <input type="password" name="password" />
      <div className="text-wrapper">Email</div>
      <input type="email" name="email" />
      <div className="text-wrapper">Address</div>
      <input type="text" name="address" />
      <br />
      <button type="submit" value={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Register;
