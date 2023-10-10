import React from "react";
import "../styles/register.css";

const Register = () => {
  const FNAME = "f_name";
  const LNAME = "l_name";
  const PASSWORD = "password";
  const EMAIL = "email";

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
        [LNAME]: data.get(LNAME),
        [PASSWORD]: data.get(PASSWORD),
        [EMAIL]: data.get(EMAIL),
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
      <input type="text" name={LNAME} />
      <div className="text-wrapper">Password</div>
      <input type="password" name={PASSWORD} />
      <div className="text-wrapper">Email</div>
      <input type="email" name={EMAIL} />
      <br />
      <button type="submit" value={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Register;
