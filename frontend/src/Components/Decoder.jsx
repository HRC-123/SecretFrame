import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Lock,
  Key,
  Download,
  RefreshCw,
  AlertTriangle,
  ImageIcon,
  ArrowRightCircle,
  LogOut,
  Copy,
  Mail,
  UserCircle2,
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import { decodeSecret, mailRecieverSecret } from "../service/api";
import { useNavigate } from "react-router-dom";

const Decoder = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [decodedSecret, setDecodedSecret] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [name, setName] = useState("");
  const fileInputRef = useRef(null);
  const profilePictureRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("email");
    const nameFromStorage = localStorage.getItem("name");
    const profilePicFromStorage = localStorage.getItem("profilePicture");

    if (emailFromStorage) {
      setUserEmail(emailFromStorage);
    }

    if (nameFromStorage) {
      setName(nameFromStorage);
    }

    if (profilePicFromStorage) {
      setProfilePicture(profilePicFromStorage);
    }
  }, []);


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

  const handleDecode = async () => {
    if (validateInputs()) {
      try {
        const response = await decodeSecret(selectedFile, userEmail);

        if (response) {
          setDecodedSecret(response.secretText);
          toast.success("Secret decoded successfully!");
        }
      } catch (error) {
        console.error("Error decoding secret:", error);
        setValidationErrors({
          decode:
            "Failed to decode image. Please check the image and try again.",
        });
        toast.error("Error decoding secret.");
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setDecodedSecret(null);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopySecret = () => {
    if (decodedSecret) {
      navigator.clipboard.writeText(decodedSecret);
      toast.success("Secret copied to clipboard!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    
      navigate("/");
    
  };

  const handleMail = async () => {
    try {
      const response = await mailRecieverSecret(decodedSecret, userEmail);
      console.log(response);
      toast.success("Mail sent successfully!");
    } catch (error) {
      toast.error("Failed to send mail.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <div className="flex items-center space-x-4">
          {/* Profile Picture Upload */}
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
            onClick={() => navigate("/encoder")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all gap-2"
          >
            <ArrowRightCircle size={20} /> Encoder Page
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all gap-2"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Rest of the component remains the same as in the previous version */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl flex space-x-6 items-start border border-gray-200">
        {/* Left Section */}
        <div className="flex flex-col w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
            <Lock className="text-indigo-500" strokeWidth={3} />
            Secure Decoder
          </h2>

          {/* Image Upload */}
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
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 w-full">
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

        {/* Right Section - Remains the same as previous version */}
        <div className="flex flex-col w-1/2 space-y-6 items-center">
          <div className="flex flex-col w-full space-y-4">
            {/* Primary Action - Decode */}
            <button
              onClick={handleDecode}
              disabled={!selectedFile}
              className={`px-4 py-3 w-full text-white rounded-lg transition-all flex items-center justify-center gap-2 text-base font-semibold ${
                selectedFile
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <Key size={20} /> Decode Secret
            </button>

            {/* Decoded Secret Display */}
            {decodedSecret && (
              <div className="w-full bg-gray-100 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ImageIcon size={18} className="text-indigo-500" />
                    Decoded Secret
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopySecret}
                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                    >
                      <Copy size={14} /> Copy
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 break-words max-h-32 overflow-y-auto">
                  {decodedSecret}
                </p>
              </div>
            )}

            {decodedSecret && (
              <button
                onClick={handleMail}
                className={`px-4 py-3 w-full text-white rounded-lg transition-all flex items-center justify-center gap-2 text-base font-semibold bg-blue-600 hover:bg-blue-700"  
              `}
              >
                <Mail size={20} /> Mail
              </button>
            )}

            {/* Secondary Actions */}
            <div className="flex flex-col space-y-2">
              {/* Reset Action */}
              <button
                onClick={handleReset}
                className="px-4 py-2 w-full bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decoder;
