import React from "react";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = AuthData();
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { email: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    const { success, message } = await login(formData.email, formData.password);
    if (success) {
      navigate("/account");
    }
    setErrorMessage(message);
  };

  return (
    <div className="page">
      <h2>Login page</h2>
      <div className="inputs">
        <div className="input">
          <input
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
            type="text"
          />
        </div>
        <div className="input">
          <input
            value={formData.password}
            onChange={(e) => setFormData({ password: e.target.value })}
            type="password"
          />
        </div>
        <div className="button">
          <button onClick={handleLogin}>Log in</button>
        </div>
        {errorMessage ? <div className="error">{errorMessage}</div> : null}
      </div>
    </div>
  );
};
