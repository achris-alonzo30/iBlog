import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // User successfully registered
  const navigate = useNavigate();
  const {isDarkMode} = useTheme();

  async function register(event) {
    event.preventDefault();
    try {
      setIsSigning(true);
      const response = await fetch("http://i-blog-five.vercel.app/api/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigning(false);
    }

    setTimeout(() => {
      setIsSuccess(false);
      setError(false);
    }, 3000);

    navigate("/sign-in");
  }
  return (
    <>
      {isSuccess && (
        <Alert severity="success">
          <AlertTitle>🎉 Success 🎉</AlertTitle>
          You have successfully registered
        </Alert>
      )}
      {error && (
        <Alert severity="error">
          <AlertTitle>
            ❌ <strong>Invalid Username</strong> ❌
          </AlertTitle>
          <strong>Username has already been taken</strong> - please try another
          name.
        </Alert>
      )}
      <form
        onSubmit={register}
        className="flex flex-col justify-center items-center sm:mx-auto  mx-4 my-auto"
      >
        <h1 className="text-6xl font-semibold mb-4 animate-bounce">Register</h1>
        <p className="text-lg font-medium text-gray/75">Hi there 👋 </p>
        <p className="text-gray/60">
          Let's start entering your details to create your account.
        </p>
        <hr className="border border-gray/50 w-full my-2" />
        <input
          type="text"
          placeholder="username"
          className="block w-full px-3 py-[0.4rem] rounded-lg border font-medium text-dark/75 mt-2 mb-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo sm:text-sm sm:leading-6 transition ease-in-out delay-150 focus:-translate-y-1 focus:scale-110 duration-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          pattern="[a-zA-Z]+"
          minLength="6"
          maxLength="20"
          required
        />
        <input
          type="password"
          placeholder="password"
          className="block w-full px-3 py-[0.4rem] rounded-lg border font-medium text-dark/75 mb-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition ease-in-out delay-150 focus:-translate-y-1 focus:scale-110 duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="6"
          maxLength="20"
          pattern="[a-zA-Z0-9]+"
          required
        />
        <button className={`shadow-lg shadow-gray/50 mb-5 w-full border border-gray ${isDarkMode ? "hover:border-gray/25" : "hover:border-gray/75"} rounded-xl px-4 py-2 bg-gray ${isDarkMode ? "hover:bg-gray/25" : "hover:bg-gray/75"} text-white font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}>
          {isSigning ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Sign Up"
          )}
        </button>
        <p className="text-gray/75">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className={`text-gray font-semibold ${isDarkMode ? "hover:text-white" : "hover:text-dark"}`}
          >
            👉🏽 Sign In 👈🏽
          </Link>
        </p>
      </form>
    </>
  );
};

export default Register;
