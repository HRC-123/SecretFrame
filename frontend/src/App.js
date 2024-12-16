import React from "react";
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
const AppRoutes = () => {
  // Check localStorage for email to determine authentication state
  const email = localStorage.getItem("email") || '';

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={email ? <Navigate to="/encoder" /> : <Login />} />

      {/* Protected Route */}
      <Route
        path="/encoder"
        element={email ? <Encoder /> : <Navigate to="/" />}
      />

      <Route
        path="/decoder"
        element={email ? <Decoder /> : <Navigate to="/" />}
      />

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId="751560940353-ba61ojjiu5o2qshra90h2seceaf9qt3a.apps.googleusercontent.com">
      <Router>
        <AppRoutes />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
