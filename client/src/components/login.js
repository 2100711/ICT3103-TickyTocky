// import React from "react";
// import "../styles/login.css";
// import constants from "../constants.js";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = new FormData(e.target);

//     // Send a POST request to the server
//     fetch("http://localhost:3001/auth/login", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         password: data.get("password"),
//         email: data.get("email"),
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           // Handle error responses here, e.g., user not found
//           console.error("Error:", response.statusText);
//           return;
//         }
//         return response.json();
//       })
//       .then((data) => {
//         // Handle the user data here
//         console.log("User data:", data);

//         // Redirect to home page after login
//         if (data.success) {
//           navigate(constants.Home);
//         }
//       })
//       .catch((error) => {
//         console.error("Fetch error:", error);
//       });
//   };

//   return (
//     <div className="login">
//       <div className="overlap-group-wrapper">
//         <div className="overlap-group">
//           <div className="whiteBox" />
//           <div className="greyBox" />
//           <div className="watch" alt="" />
//           <div className="logo" alt="" />
//           <form onSubmit={handleSubmit}>
//             <input
//               className="email"
//               name="email"
//               placeholder="Email"
//               autoComplete="True"
//             ></input>
//             <input
//               className="password"
//               name="password"
//               placeholder="Password"
//             ></input>
//             <a href={constants.Home} className="forgotPass">
//               Forgot Password?
//             </a>
//             <button className="loginBtn" type="submit">
//               Log In
//             </button>
//           </form>
//           <p className="registerDiv">
//             <a href={constants.Register} className="register">
//               Register
//             </a>
//             <span className="body"> to start your watch journey</span>
//           </p>
//           <div className="close">X</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
