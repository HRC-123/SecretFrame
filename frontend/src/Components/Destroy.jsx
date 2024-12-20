import React, { useState, useRef } from "react";
import {
  Upload,
  Lock,
  Key,
  RefreshCw,
  AlertTriangle,
  ArrowRightCircle,
  LogOut,
  UserCircle2,
  House,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import { destroySecret } from "../service/api";
import { useNavigate } from "react-router-dom";

import { useGlobalContext } from "../context/GlobalContext";

const Destroy = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);
  const profilePictureRef = useRef(null);
  const navigate = useNavigate();

  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  const { email, name, profilePicture } = googleLoginDetails;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInputs = () => {
    const errors = {};

    if (!selectedFile) {
      errors.file = "Please upload an encoded image";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleDestroy = async () => {
   if (validateInputs()) {
     try {
       await toast.promise(
         destroySecret(selectedFile, email), 
         {
           loading: "Destroying secret...",
           success: "Secret destroyed successfully!",
           error: (error) =>
             error?.msg ||
             "Failed to destroy image. Please check the image and try again.",
         }
       );
     } catch (error) {
       console.error("Error destroying secret:", error);
       setValidationErrors({
         decode:
           error?.msg ||
           "Failed to destroy image. Please check the image and try again.",
       });
     }
   } else {
     toast.error("There are some errors. Please check!!");
   }
 };


  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.success("Data cleared");
  };



  const handleLogout = () => {
    localStorage.clear();
    setGoogleLoginDetails({
      email: "",
      name: "",
      profilePicture: "",
    });

    toast.success("Logged out successfully!");

    navigate("/");
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-8">
      <Toaster position="top-center" />

   
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <div className="flex items-center space-x-4">
         
          <label className="cursor-pointer">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <UserCircle2
                className="w-12 h-12 text-gray-400 hover:text-indigo-600"
                onClick={() => profilePictureRef.current.click()}
              />
            )}
          </label>

          <div className="text-xl font-semibold text-indigo-600">
            Welcome, {name || "User"}!
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all gap-2"
          >
            <House size={20} /> Home
          </button>
          <button
            onClick={() => navigate("/encoder")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all gap-2"
          >
            <ArrowRightCircle size={20} /> Encoder
          </button>
          <button
            onClick={() => navigate("/decoder")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all gap-2"
          >
            <ArrowRightCircle size={20} /> Decoder
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all gap-2"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl flex space-x-6 items-start border border-gray-200">
       
        <div className="flex flex-col w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
            <Lock className="text-indigo-500" strokeWidth={3} />
            Secure Destroy
          </h2>

          <div className="flex flex-col w-full space-y-4">
           
            <div className="flex flex-row space-x-8 py-2 px-2">
              <button
                onClick={handleDestroy}
                disabled={!selectedFile}
                className={`px-4 py-2 w-full  text-white rounded-lg  transition-all flex items-center justify-center gap-2 ${
                  selectedFile
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Key size={20} /> Destroy Secret
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 w-full bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} /> Reset
              </button>
            </div>

          
          </div>
        </div>

       
        <div className="flex flex-col w-1/2 space-y-6 items-center">
          
          <div className="flex flex-col items-center justify-center w-full">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              Upload Encoded Image
            </h3>
            <label
              className={`flex flex-col items-center justify-center  h-64 w-auto border-2 rounded-lg cursor-pointer transition-all ${
                validationErrors.file
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {imagePreview ? (
                <div className="w-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg shadow-md max-h-64 mx-auto"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 w-96">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-500 text-center">
                    Click to upload or drag and drop
                    <br />
                    encoded image
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              )}
            </label>
            {validationErrors.file && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={14} /> {validationErrors.file}
              </p>
            )}
          </div>

          {validationErrors.decode && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle size={14} /> {validationErrors.decode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Destroy;
