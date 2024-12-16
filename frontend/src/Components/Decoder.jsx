import React, { useState, useRef } from "react";
import {
  Upload,
  Lock,
  Key,
  Download,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import { decodeSecret } from "../service/api"; // Assuming you'll create this API method

const Decoder = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [decodedSecret, setDecodedSecret] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

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

    if (!selectedFile) {
      errors.file = "Please upload an encoded image";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDecode = async () => {
    if (validateInputs()) {
      try {
        // Get user email from localStorage
        const userEmail = localStorage.getItem("email");

        // Call the decodeSecret function to retrieve the hidden message
        const response = await decodeSecret(selectedFile, userEmail);

        if (response) {
          setDecodedSecret(response.secretText);
        }
      } catch (error) {
        console.error("Error decoding secret:", error);
        setValidationErrors({
          decode:
            "Failed to decode image. Please check the image and try again.",
        });
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
      // You might want to add a toast or temporary notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-indigo-600 flex items-center justify-center gap-3 mb-6">
          <Lock className="text-indigo-500" strokeWidth={3} />
          Secure Decoder
        </h2>

        <div className="space-y-5">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
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
                      Click to upload or drag and drop encoded image
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

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={handleDecode}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Key size={20} />
                Decode
              </button>

              <button
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                onClick={handleReset}
              >
                <RefreshCw size={20} />
                Reset
              </button>
            </div>

            {validationErrors.decode && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={14} /> {validationErrors.decode}
              </p>
            )}

            {/* Decoded Secret Display */}
            {decodedSecret && (
              <div className="mt-4 bg-gray-100 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ImageIcon size={18} className="text-indigo-500" />
                    Decoded Secret
                  </h3>
                  <button
                    onClick={handleCopySecret}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-gray-800 break-words">{decodedSecret}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decoder;
