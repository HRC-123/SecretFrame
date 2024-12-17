import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Image,
  Lock,
  Key,
  Send,
  Download,
  RefreshCw,
  Check,
  AlertTriangle,
  Mail,
  LogOut,
  ArrowRightCircle,
  UserCircle2,
} from "lucide-react";
import { encodeSecret, mailReciever } from "../service/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";


const Encoder = () => {
  const [st, setSt] = useState("");
  const [recieverEmail, setRecieverEmail] = useState("");
  // const [senderEmail, setSenderEmail] = useState("");
  // const [name, setName] = useState('');
  // const [profilePicture, setProfilePicture] = useState('');
  const [manual, setManual] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [encodedImage, setEncodedImage] = useState(null);
 const profilePictureRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  const { email:senderEmail, name, profilePicture } = googleLoginDetails;

  // useEffect(() => {
  //   const emailSender = localStorage.getItem("email");
  //   if (emailSender) {
  //     setSenderEmail(emailSender);
  //   }

  //     const name = localStorage.getItem("name");
  //     if (name) {
  //       setName(name);
  //   }
    
  //     const profile = localStorage.getItem("profilePicture");
  //     if (profile) {
  //       setProfilePicture(profile);
  //     }
  // }, []);

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

    if (!st.trim()) {
      errors.st = "Secret text is required";
    }

    if (!recieverEmail.trim()) {
      errors.email = "Receiver's email is required";
    } else if (!/\S+@\S+\.\S+/.test(recieverEmail)) {
      errors.email = "Invalid email format";
    }

    if (manual && !selectedFile) {
      errors.file = "Please upload an image";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async () => {
    if (validateInputs()) {
      setGenerated(false);

      try {
        const encodedImageBuffer = await encodeSecret(
          selectedFile,
          st,
          recieverEmail,
          senderEmail
        );

        if (encodedImageBuffer) {
          setGenerated(true);
          setEncodedImage(encodedImageBuffer);
          toast.success("Image encoded successfully!");
        }
      } catch (error) {
        toast.error("Error encoding secret. Please try again.");
      }
    } else {
      toast.error("Please fix validation errors.");
    }
  };

  const handleDownload = () => {
    if (encodedImage) {
      const blob = new Blob([encodedImage], { type: "image/jpeg" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "encoded_image.jpg";
      link.click();
    }
  };

  const handleMail = async () => {
    try {
      const response = await mailReciever(encodedImage, recieverEmail);
      toast.success("Mail sent successfully!");
    } catch (error) {
      toast.error("Failed to send mail.");
    }
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

  const handleReset = () => {
    setSt("");
    setRecieverEmail("");
    setManual(false);
    setGenerated(false);
    setSelectedFile(null);
    setImagePreview(null);
    setValidationErrors({});
    setEncodedImage(null);
    fileInputRef.current = null;
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
            onClick={() => navigate("/decoder")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all gap-2"
          >
            <ArrowRightCircle size={20} /> Decode Page
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
        {/* Left Section */}
        <div className="flex flex-col w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-3">
            <Lock className="text-indigo-500" strokeWidth={3} />
            Secure Encoder
          </h2>

          {/* Secret Text Input */}
          <div>
            <label
              htmlFor="secrettext"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Key className="text-indigo-500" size={18} /> Secret Text
            </label>
            <input
              id="secrettext"
              name="secrettext"
              type="text"
              value={st}
              onChange={(e) => setSt(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                validationErrors.st
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Enter your secret text"
            />
            {validationErrors.st && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={14} /> {validationErrors.st}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Send className="text-indigo-500" size={18} /> Receiver's Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={recieverEmail}
              onChange={(e) => setRecieverEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                validationErrors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Enter email address"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={14} /> {validationErrors.email}
              </p>
            )}
          </div>

          {/* Image Selection */}
          <div>
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setManual(false)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  !manual
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                <Image size={18} /> Auto Generate
              </button>
              <button
                onClick={() => setManual(true)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  manual
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                <Upload size={18} /> Manual Upload
              </button>
            </div>
            {manual && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <Upload size={18} /> Upload Image
                  </button>
                  {selectedFile && (
                    <p className="text-sm text-gray-700">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                {validationErrors.file && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle size={14} /> {validationErrors.file}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col w-1/2 space-y-6 items-center">
          {imagePreview && (
            <div className="w-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg shadow-md max-h-64 mx-auto"
              />
            </div>
          )}
          <div className="flex flex-col items-center w-full space-y-4">
            {/* Primary Action */}
            <button
              onClick={handleGenerate}
              className="px-4 py-2 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Key size={20} /> Generate
            </button>

            {/* Secondary Actions in a Single Group */}
            {generated && (
              <div className="flex flex-col w-full space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download
                </button>
                <button
                  onClick={handleMail}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={20} /> Send
                </button>
              </div>
            )}

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
  );
};

export default Encoder;
