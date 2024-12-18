import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./Components/Login";
import Encoder from "./Components/Encoder";
import Decoder from "./Components/Decoder";
import Secret404Page from "./Components/Secret404Page";
import HomePage from "./Components/HomePage";
import { GlobalProvider, useGlobalContext } from "./context/GlobalContext";


const AppRoutes = () => {
  // Check localStorage for email to determine authentication state

  // dotenv.config();

  console.log(process.env.REACT_APP_CLIENT_ID);

  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
const email = localStorage.getItem("email") || null;
const name = localStorage.getItem("name") || null;
const profilePicture = localStorage.getItem("profilePicture") || null;

  useEffect(() => {
     

    // const { email } = googleLoginDetails;
    // const email = localStorage.getItem("email") || '';

    setGoogleLoginDetails({
      email: email,
      name: name,
      profilePicture: profilePicture,
    });
  }, []);

 

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<HomePage />} />

      {/* Protected Route */}
      <Route
        path="/encoder"
        element={email ? <Encoder /> : <Navigate to="/" />}
      />

      <Route
        path="/decoder"
        element={email ? <Decoder /> : <Navigate to="/" />}
      />
      <Route path='/404notfound' element={<Secret404Page />} />

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/404notfound" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <GlobalProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <Router>
          <AppRoutes />
        </Router>
      </GoogleOAuthProvider>
    </GlobalProvider>
  );
};

export default App;
