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
  Radio,
  Mail
} from "lucide-react";
import { encodeSecret,mailReciever } from "../service/api";
const Encoder = () => {
  const [st, setSt] = useState("");
  const [email, setEmail] = useState("");
  const [manual, setManual] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // const [encodingProgress, setEncodingProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
 
  const fileInputRef = useRef(null);
   const [encodedImage, setEncodedImage] = useState(null);

   const handleFileChange = (e) => {
     const file = e.target.files[0];
     if (file) {
       setSelectedFile(file);

       // Create image preview
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

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
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
    // setEncodingProgress(0);

    try {
      // Call the encodeSecret function to get the encoded image
      const encodedImageBuffer = await encodeSecret(
        selectedFile,
        st,
        email,
        "hrc@gmail.com"
      );

      if (encodedImageBuffer) {
        setGenerated(true);
        setEncodedImage(encodedImageBuffer); // Store the encoded image buffer in state
      }
    } catch (error) {
      console.error("Error encoding secret:", error);
    }
  }
};

  
   const handleDownload = () => {
     if (encodedImage) {
       // Create a Blob from the encoded image data
       const blob = new Blob([encodedImage], { type: "image/jpeg" });
       const link = document.createElement("a");
       link.href = URL.createObjectURL(blob);
       link.download = "encoded_image.jpg"; // Set the filename
       link.click(); // Trigger the download
     }
  };
  
  const handleReset = () => {
    setSt("");
    setEmail("");
    setManual(false);
    setGenerated(false);
    setSelectedFile(null);
    setImagePreview(null);
    // setEncodingProgress(0);
    setValidationErrors({});
    setEncodedImage(null);
     fileInputRef.current = null;

  }

  const handleMail = async () => {
    const response = await mailReciever(encodedImage, email);

    console.log(response);

    //Toast mail sent successfully
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-indigo-600 flex items-center justify-center gap-3 mb-6">
          <Lock className="text-indigo-500" strokeWidth={3} />
          Secure Encoder
        </h2>

        <div className="space-y-5">
          {/* Security Level Selector */}
          {/* <div className="flex justify-between items-center">
            <SecurityLevelIndicator />
            <div className="flex space-x-2">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => setSecurityLevel(level)}
                  className={`w-8 h-2 rounded-full transition-all ${
                    securityLevel === level
                      ? "bg-indigo-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div> */}

          {/* Secret Text Input */}
          <div>
            <label
              htmlFor="secrettext"
              className="block text-sm font-medium text-gray-700 mb-2  items-center gap-2"
            >
              <Key className="text-indigo-500" size={18} />
              Secret Text
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
              <Send className="text-indigo-500" size={18} />
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="space-y-4">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setManual(false)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  !manual
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Image size={20} />
                Random Image
              </button>
              <button
                onClick={() => setManual(true)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  manual
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Upload size={20} />
                Manual Image
              </button>
            </div>

            {manual ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  {/* Remove the onClick here */}
                  <label
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 rounded-lg cursor-pointer transition-all ${
                      validationErrors.file
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="mb-2 text-sm text-gray-500">
                          Click to upload or drag and drop
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                {validationErrors.file && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle size={14} /> {validationErrors.file}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 italic flex items-center justify-center gap-2">
                <Image size={20} />
                Random image will be chosen
              </div>
            )}
          </div>

          {/* Generate Button with Progress */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={handleGenerate}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Key size={20} />
                Generate
              </button>

              <button
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                onClick={handleReset}
              >
                <RefreshCw size={20} />
                Reset
              </button>
            </div>

            {/* {encodingProgress > 0 && encodingProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${encodingProgress}%` }}
                />
              </div>
            )} */}

            {generated && (
              <div className="flex space-x-4">
                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  onClick={handleDownload}
                >
                  <Download size={20} />
                  Download
                </button>

                <button
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  onClick={handleMail}
                >
                  <Mail size={24} />
                  Mail
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encoder;