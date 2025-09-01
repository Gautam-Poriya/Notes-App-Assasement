import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "./formContext";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormContext();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false); // control OTP field visibility
  const [enteredOtp, setEnteredOtp] = useState(""); // user-entered OTP

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name) return "Name is required.";
    if (!formData.dob) return "Date of Birth is required.";
    if (!formData.email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Invalid email format.";
    return null;
  };

  // Handle OTP generation
  const handleGenerateOtp = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "https://notes-app-assasement-1.onrender.com/api/auth/signup/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            dob: formData.dob,
            email: formData.email,
          }),
        }
      );

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        setFormData({ ...formData, otp: data.otp });
        console.log("Form Data", formData); // store OTP from backend
        setOtpVisible(true); // show OTP input
        // alert("OTP generated successfully!");
      } else {
        setError(data.message || "Failed to generate OTP.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (enteredOtp === formData.otp) {
      // alert("OTP Verified Successfully ✅");
      const response = await fetch(
        "https://notes-app-assasement-1.onrender.com/api/auth/signup/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            dob: formData.dob,
            email: formData.email,
            otp: enteredOtp,
          }),
        }
      );
      const data = await response.json();
      localStorage.setItem("token", data.token);
      console.log("Token Is:", data.token);

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
  };
  function handleSignInClick() {
    navigate("/SignIn");
  }

  return (
    <div className="flex  ml-0 mr-0 pl-0 pr-0">
      {/* Div 1: Logo */}

      <div className="w-[591px] flex flex-col justify-center p-[32px] mt-0 sm:w-[375px] sm:h-[812px] ">
        <div className="w-[79px] h-[32px] flex items-center gap-[12px] sm:w-full sm:h-[32px]  sm:top-[55px] sm:left-[16px]  ">
          <img src="/icon.png" alt="Not Found" className="w-[32px] h-[32px]" />
          <p className=" ">HD</p>
        </div>
      

        {/* Div 2: Title & Description */}
        <div className=" flex  items-center justify-between p-[32px] mt-0 ml-[64px] mr-[64px] w-[527px] h-[928px]  ">
          <div className="h-[401px] w-[399px] gap-[32px] ">
            <div className="gap-[12px] h-[83px]">
              <h2 className="text-3xl font-bold text-gray-800 text-left">
                Signup
              </h2>
              <p className="text-gray-600 mt-2">
               Sign up to enjoy the feature of HD
              </p>
            </div>

            {/* Div 3: Signup Form */}
            <div className="max-w-md  rounded-2xl w-[399px] h-[291px] gap-[20px]">
              <form className="space-y-4">
                {/* Hidden OTP field (internal) */}
                <input type="hidden" name="otp" value={formData.otp} />

                {/* Name */}

                <div className="relative w-[399px]">
                  <label className="absolute ml-0 p-0 -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full h-[59px] rounded-[10px] border-[1.5px] border-gray-300 p-[16px] gap-[2px] focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* DOB */}

                <div className="relative w-[399px] gap-[10px]">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full h-[59px] rounded-[10px] border-[1.5px] border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Email */}

                <div className="relative w-[399px]">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-[59px] rounded-[10px] border-[1.5px] p-[16px] gap-[2px] border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Generate OTP Button */}
                {!otpVisible && (
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={loading}
                    className=" bg-blue-600 w-[399px] h-[54px] rounded-[10px] pt-[16px] pr-[8px] pb-[16px] pl-[8px] gap-[8px] text-white py-2  hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Get OTP"}
                  </button>
                )}

                {/* OTP Field (visible after OTP is generated) */}
                {otpVisible && (
                  <div className="space-y-4">
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        name="enteredOtp"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        maxLength={6}
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none tracking-widest text-center"
                        placeholder="6-digit OTP"
                      />
                    </div> */}
                    <div className="relative w-[399px]">
                      <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        name="enteredOtp"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        maxLength={6}
                        className="w-full h-[59px] rounded-[10px] border-[1.5px] p-[16px] gap-[2px] border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none tracking-widest text-left"
                        placeholder="OTP"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-400 transition"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                <div className="w-[399px] h-[27px] flex items-center justify-center ">
                  <p className="">
                    Already have an account??{" "}
                    <button
                      className="text-blue-400 border-b-[1px] border-blue-400"
                      onClick={handleSignInClick}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[849px] h-full flex flex-col ml-56 justify-center items-center  overflow-hidden rounded-2xl ">
        <img
          src="/right.png"
          alt="Not Found"
          className="w-[849px] h-[1024px]  object-cover object-center"
        />
      </div>
     
    </div>
  );
};

export default SignUp;
