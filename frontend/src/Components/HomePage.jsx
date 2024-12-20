import React, { useState, useEffect } from "react";
import {
  Lock,
  Shield,
  Shuffle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Key,
  LogOut,
  Globe,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Trash,
  ScanEye,
  LocateFixed,
  UserRoundPlus,
  FileCode,
} from "lucide-react";


import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const HomePage = () => {
  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [encodeCount, setEncodeCount] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };


     const fetchUsersCount = async () => {
       const response = await fetch(`${process.env.REACT_APP_API_URL}/count`);
      const data = await response.json();
      // console.log(data);
       setUserCount(data?.count || 0);
       setEncodeCount(data?.encode || 0);
     };
     fetchUsersCount();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onLoginSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    // console.log("Login Success! Current user: ", decoded);

    // console.log("Login Success! Current user: ", decoded);

    localStorage.setItem("email", decoded?.email);
    localStorage.setItem("name", decoded?.name);
    localStorage.setItem("profilePicture", decoded?.picture);

    setGoogleLoginDetails({
      email: decoded?.email,
      name: decoded?.name,
      profilePicture: decoded?.profilePicture,
    });

    toast.success(`Successfully LoggedIn : ${decoded?.name}`)

    navigate("/");
  };

  const onLoginFailure = (res) => {
    console.error("Login Failed: ", res);
    toast.error("Login failed. Please try again.");
  };

  const handleLogout = () => {
    localStorage.clear();
    setGoogleLoginDetails({
      email: "",
      name: "",
      profilePicture: "",
    });
    toast.success("You have successfully logged out.");
    navigate("/");
  };

  const features = [
    {
      icon: <Lock className="w-12 h-12 text-blue-600" />,
      title: "Military-Grade Encryption",
      description:
        "Advanced encryption ensures your secrets remain completely confidential, unreadable to anyone without authorization.",
      color: "blue",
    },
    {
      icon: <Shield className="w-12 h-12 text-green-600" />,
      title: "Email-Bound Security",
      description:
        "Each shared image is securely linked to specific sender and receiver email addresses, preventing unauthorized access.",
      color: "green",
    },
    {
      icon: <Shuffle className="w-12 h-12 text-purple-600" />,
      title: "Invisible Steganography",
      description:
        "Encrypted text is seamlessly embedded within images without any visible alterations, maintaining complete visual integrity.",
      color: "purple",
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-teal-600" />,
      title: "Tamper Detection",
      description:
        "Instant invalidation of embedded secrets if any image modification is detected, providing robust security.",
      color: "teal",
    },
    {
      icon: <Key className="w-12 h-12 text-indigo-600" />,
      title: "Zero-Knowledge Proof",
      description:
        "Our system ensures message contents are never stored or known by the platform, guaranteeing absolute privacy.",
      color: "indigo",
    },
    {
      icon: <Globe className="w-12 h-12 text-red-600" />,
      title: "Cross-Platform Compatible",
      description:
        "Works seamlessly across web and mobile platforms, ensuring your secure communication knows no boundaries.",
      color: "red",
    },
  ];

  const faqs = [
    {
      question: "How secure is Secret Frame?",
      answer:
        "Secret Frame uses end-to-end encryption with email-based authentication, making it virtually impossible for unauthorized parties to access your hidden messages.",
      icon: <Shield className="w-6 h-6 text-green-500 mr-3" />,
    },
    {
      question: "Can the hidden message be detected?",
      answer:
        "No. Our advanced steganography techniques ensure the encrypted text is completely imperceptible within the image.",
      icon: <UserCheck className="w-6 h-6 text-blue-500 mr-3" />,
    },
    {
      question: "What happens if someone tries to tamper with the image?",
      answer:
        "Any modification to the image will immediately invalidate the embedded secret, providing robust tamper detection.",
      icon: <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />,
    },
    {
      question: "Is my personal information safe?",
      answer:
        "We use OAuth for secure login and never store sensitive information. Your data is protected with military-grade encryption.",
      icon: <Lock className="w-6 h-6 text-purple-500 mr-3" />,
    },
  ];

  const formatUserCount = (count) => {
    return count
      .toString()
      .split("")
      .map((digit, index) => (
        <div
          key={index}
          className="bg-orange-50 text-orange-900 font-semibold text-2xl w-12 h-12 flex items-center justify-center rounded-md"
        >
          {digit}
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative">
     
      <Toaster position="top-center" />
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-900">Secret Frame</h2>
          </div>

          <div className="flex items-center space-x-4 ">
            {!googleLoginDetails?.email ? (
              <GoogleLogin
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                size="large"
              />
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <p className="font-bold">{googleLoginDetails.name}</p>
                  <p className="text-xs">{googleLoginDetails.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                    onClick={() => navigate("/encoder")}
                  >
                    <LocateFixed className="mr-2 w-4 h-4" /> Encoder
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                    onClick={() => navigate("/decoder")}
                  >
                    <ScanEye className="mr-2 w-4 h-4" /> Decoder
                  </button>
                  <button
                    onClick={() => navigate("/destroy")}
                    className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all gap-2"
                  >
                    <Trash size={20} /> Destroy
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      
      <header className="container mx-auto px-6 pt-32 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Secret Frame
            <span className="block text-2xl font-medium text-blue-600 mt-3">
              Privacy in every Pixel.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Securely share confidential messages within images, invisible to the
            naked eye, with military-grade encryption and advanced
            steganography.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
              onClick={() => {
                googleLoginDetails?.email
                  ? navigate("/encoder")
                  : toast.error("Please login first ");
              }}
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Security, Seamless Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protect your sensitive information with cutting-edge encryption and
            steganography technology that ensures absolute confidentiality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition transform hover:scale-105 border-b-4 border-transparent hover:border-blue-500"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

    
      <section className="container mx-auto px-6 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get answers to the most common questions about Secret Frame's
            innovative security approach.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 transition hover:shadow-md"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
              >
                <div className="flex items-center">
                  {faq.icon}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                {expandedFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
              {expandedFaq === index && (
                <p className="mt-4 text-gray-600 pl-9">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-evenly items-center">
          <div className="mt-10 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Users who have accessed this website
            </h3>
            <div className="flex justify-center items-center space-x-2">
              {formatUserCount(userCount)}{" "}
              <UserRoundPlus
                size={24}
                className="text-orange-600"
                aria-label="User Count Icon"
              />
            </div>
            <p className="mt-2 text-sm text-orange-600">
              ⚡ Updated in real time
            </p>
          </div>

          <div className="mt-10 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Images encoded using this website
            </h3>
            <div className="flex justify-center items-center space-x-2">
              {formatUserCount(encodeCount)}{" "}
              <FileCode
                size={24}
                className="text-orange-600"
                aria-label="Encoded Count Icon"
              />
            </div>
            <p className="mt-2 text-sm text-orange-600">
              ⚡ Updated in real time
            </p>
          </div>
        </div>
      </section>

      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Secret Frame</h2>
            <p className="text-gray-400 text-lg">
              Secure Communication. Invisible Messaging.
            </p>
          </div>

         
          <div className="border-t border-gray-700 my-6"></div>

        
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
           
            <p className="text-gray-400 text-sm">
              © 2024 <span className="font-semibold">Secret Frame</span>. All
              Rights Reserved.
            </p>

           
            <p className="text-gray-400 text-sm">
              Created by{" "}
              <span className="font-semibold text-white">
                Ramcharan Hanumanthu
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
