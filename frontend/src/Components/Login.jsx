import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [user, setUser] = useState(null);

  const onSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    console.log("Login Success! Current user: ", decoded);
    setUser(decoded); // Set the decoded user information to state
  };

  const onFailure = (res) => {
    console.log("Login Failed: ", res);
  };

  const onLogoutSuccess = () => {
    googleLogout(); // This logs the user out of their Google account
    console.log("Logout successful");
    setUser(null); // Clear user state on logout
  };

  return (
    <div>
      <h2>Login</h2>
      {!user ? (
        <>
          <GoogleLogin onSuccess={onSuccess} onFailure={onFailure} />
          <p>Click to login</p>
        </>
      ) : (
        <div>
          <h3>Welcome, {user.name}!</h3>
          <button onClick={onLogoutSuccess}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
