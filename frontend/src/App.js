import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Encoder from "./Components/Encoder";
import Decoder from "./Components/Decoder";
import Secret404Page from "./Components/Secret404Page";
import HomePage from "./Components/HomePage";
import { GlobalProvider, useGlobalContext } from "./context/GlobalContext";
import Destroy from "./Components/Destroy";

const AppRoutes = () => {
  // console.log(process.env.REACT_APP_CLIENT_ID);

  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  const email = localStorage.getItem("email") || null;
  const name = localStorage.getItem("name") || null;
  const profilePicture = localStorage.getItem("profilePicture") || null;

  useEffect(() => {
    setGoogleLoginDetails({
      email: email,
      name: name,
      profilePicture: profilePicture,
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/encoder"
        element={email ? <Encoder /> : <Navigate to="/" />}
      />

      <Route
        path="/decoder"
        element={email ? <Decoder /> : <Navigate to="/" />}
      />

      <Route
        path="/destroy"
        element={email ? <Destroy /> : <Navigate to="/" />}
      />

      <Route path="/404notfound" element={<Secret404Page />} />

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
