import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [showOtp, setShowOtp] = useState(false);

  // ✅ Email validation regex
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ✅ Generate OTP handler
  const handleGenerateOtp = async () => {
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    setError("");

    try {
      // Call backend API to generate OTP
      // Example: await axios.post("/api/auth/send-otp", { email });
      console.log("OTP requested for:", email);
      const response = await fetch(
        "http://localhost:5000/api/auth/signin/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
      const data = await response.json();
      console.log("Response Data:", data);
      if (response.ok) {
        setFormData({ ...formData, otp: data.otp });
        console.log("Form Data", formData); // store OTP from backend
        // setOtpVisible(true); // show OTP input
        alert("OTP generated successfully!");
      } else {
        setError(data.message || "Failed to generate OTP.");
      }

      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    }
  };
  // handel create one
  function handleCreateOne(){
    navigate("/");
  }
  // ✅ Validate OTP handler
  const handleValidateOtp = async () => {
    if (otp === formData.otp) {
      alert("OTP Verified Successfully ✅");
      const response = await fetch(
        "http://localhost:5000/api/auth/signin/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
          }),
        }
      );
      const data = await response.json();
      console.log(" OTP Verify Response Data:", data);
      if (response.ok) {
        navigate("/Todo");
      } else {
        setError(data.message || "OTP Verification failed.");
        navigate("/SignUp");
      }
    } else {
      setError("Invalid OTP ❌");
    }
    setError("");

    try {
      // Call backend API to validate OTP
      // Example: const res = await axios.post("/api/auth/verify-otp", { email, otp });
      console.log("Validating OTP:", otp);

      // Redirect to home page
      window.location.href = "/Todo";
    } catch (err) {
      setError("Invalid OTP. Try again.");
    }
  };


  return (
    <div className="flex min-h-screen  ml-0 mr-0 pl-0 pr-0 xs:w-[375px] xs:h-[812px]">
      {/* Left Div - Logo */}
      <div className="w-[591px] flex flex-col justify-center  p-[32px] mt-0 xs:w-[375px] xs:h-[812px]">
        <div className="w-[79px] h-[32px] flex items-center justify-center gap-[12px] sm:w-[343px] sm:h-[32px] sm:top-[55px] sm:left-[16px] sm:gap-[10px] sm:flex sm:items-center sm:justify-center sm:bg-blue-400">
          <img src="/icon.png" alt="Not Found" className="w-[32px] h-[32px]" />
          <p>HD</p>
        </div>

        {/* Right Div - Sign In */}
        <div className=" flex justify-center items-center mt-0 ml-[64px] mr-[64px] w[527px] h-[928px] ">
          <div className="h-[401px] w-[399px] gap-[32px]">
            {/* Header Section */}
            <div className="gap-[12px] h-[83px]">
              <h2 className="text-3xl font-bold text-gray-800 text-left">
                Sign In
              </h2>
              <p className="text-gray-600 mt-2">
                Enter your email and OTP to access your account.
              </p>
            </div>

            {/* Form Section */}
            <div className="max-w-md  rounded-2xl w-[399px] h-[291px] gap-[20px]">
              {/* <form className="space-y-4"> */}
              <div className="relative w-[399px]">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-[59px] rounded-[10px] border-[1.5px] p-[16px] gap-[2px] border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* OTP Section */}
              {otpSent && (
                <div className="space-y-4">
                  <div className="relative w-[399px] mt-4">
                    {/* <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                      Enter OTP
                    </label> */}
                    <input
                      type={showOtp ? "text" : "password"}
                      placeholder="OTP"
                      className=" font-inter w-full h-[59px] rounded-[10px] border-[1.5px] p-[16px] gap-[2px] border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none tracking-widest text-left"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showOtp ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>
              )}
              {otpSent && (
                <button
                  onClick={handleGenerateOtp}
                  className=" text-blue-400 ml-0 border-b-[1px] border-blue-400"
                >
                  Resend OTP
                </button>
              )}
              <div className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                  className="mr-2"
                />
                <label className="text-gray-700">Keep me logged in</label>
              </div>
              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Buttons */}
              {!otpSent ? (
                
                  
                <button
                  onClick={handleGenerateOtp}
                  className="bg-blue-600 w-[399px] h-[54px] mt-3 rounded-[10px] pt-[16px] pr-[8px] pb-[16px] pl-[8px] gap-[8px] text-white py-2  hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Sign In
                </button>
              ) : (
                <>
                  <button
                    onClick={handleValidateOtp}
                    className="bg-blue-600 w-[399px] h-[54px] rounded-[10px] mt-4 pt-[16px] pr-[8px] pb-[16px] pl-[8px] gap-[8px] text-white py-2  hover:bg-blue-700 transition disabled:opacity-50"
                  >
                     Sign In
                  </button>
                  
                </>
              )}
             {/* Not An Account Creat Account */}
             <div className="w-[399px] h-[27px] flex justify-center items-center mt-4 gap-[10px]">
              <p>Need an Account?<button className="text-blue-400 border-b-[1px] ml-[6px] border-blue-400" onClick={handleCreateOne}>Create one</button></p>
             </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[849px] flex flex-col justify-center items-center bg-slate-700 overflow-hidden rounded-2xl border">
        <img
          src="/rightImage.jpg"
          alt="Not Found"
          className="w-full h-full  object-cover object-center"
        />
      </div>
    </div>
  );
};

export default SignIn;
