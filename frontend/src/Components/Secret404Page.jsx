import React, { useState } from "react";
import { Lock, Unlock, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Secret404Page = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const navigate = useNavigate();

  const handleUnlock = () => {
    toast.success("Secret unlocked! 🎉", { position: "top-center" });
    setIsUnlocked(true);
    setTimeout(() => {
      setSecretRevealed(true);
      toast("Enjoy the hidden treasure!", {
        icon: "🎉",
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    }, 1000);
  };

  const handleNavigate = (path) => {
    toast.loading("Redirecting...", { position: "top-center" });
    setTimeout(() => {
      navigate(path);
      toast.dismiss();
      toast.success(`Welcome to ${path === "/" ? "Home" : "Encoder"}!`, {
        position: "top-center",
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <Toaster position="top-center" reverseOrder={true} />
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl text-center">
        
        {!isUnlocked ? (
          <Lock
            className="mx-auto mb-6 text-indigo-500 animate-pulse"
            size={80}
          />
        ) : (
          <Unlock className="mx-auto mb-6 text-green-500" size={80} />
        )}

       
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          {isUnlocked ? "Secret Unlocked!" : "404: Page Not Found"}
        </h1>

      
        <p className="text-gray-600 mb-8">
          {isUnlocked
            ? "You've uncovered a hidden message. What will you do next?"
            : "This page might be hiding something... are you curious enough to find out?"}
        </p>

      
        {!isUnlocked ? (
          <button
            onClick={handleUnlock}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105"
          >
            <Unlock size={20} />
            Unlock Secret
          </button>
        ) : (
          <div
            className={`transition-all duration-700 ${
              secretRevealed ? "opacity-100" : "opacity-0"
            }`}
          >
           
            <div className="bg-indigo-100 border border-indigo-200 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-indigo-700">
                🎉 Hidden Message
              </h2>
              <p className="text-gray-600 mt-2">
                "Sometimes, curiosity uncovers hidden treasures. Great job!"
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleNavigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <ArrowRightCircle size={18} />
                Home
              </button>
              <button
                onClick={() => handleNavigate("/encoder")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <Lock size={18} />
                Go to Encoder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Secret404Page;
