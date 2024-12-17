import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import { useGlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const Login = () => {

  const { setGoogleLoginDetails } = useGlobalContext();
  

  const navigate = useNavigate();
  // const { googleLoginDetails,setGoogleLoginDetails } = useGlobalContext();

  const onSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    console.log("Login Success! Current user: ", decoded);
    
   localStorage.setItem("email", decoded?.email);
   localStorage.setItem("name", decoded?.name);
    localStorage.setItem("profilePicture", decoded?.picture);
    
    setGoogleLoginDetails({
      email: decoded?.email,
      name: decoded?.name,
      profilePicture: decoded?.profilePicture
    })

    // console.log(googleLoginDetails);

       navigate("/encoder");
 
   
  };

  const onFailure = (res) => {
    console.log("Login Failed: ", res);
  };



  return (
    <div>
      <h2>Login</h2>
      
        
          <GoogleLogin onSuccess={onSuccess} onFailure={onFailure} />
        
        
     
    </div>
  );
};

export default Login;
