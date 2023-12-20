import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const { isDarkMode } = useTheme();

  async function login(event) {
    event.preventDefault();
    try {
      setIsLogging(true);
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();

        // Assuming `userInfo` contains user information after login
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setUserInfo(userInfo);

        // Set user information in cookies
        document.cookie = `userInfo=${JSON.stringify(
          userInfo
        )}; secure; samesite=strict`;

        setRedirect(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLogging(false);

      // Reset error state after 2 seconds
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }

  // Redirect if needed
  if (redirect) {
    return <Navigate to={"/home"} />;
  }

  return (
    <>
      {error && (
        <Alert severity="error">
          <AlertTitle>🚨 Login Failed 🚨</AlertTitle>
          You have entered invalid credentials -{" "}
          <strong>please try again.</strong>
        </Alert>
      )}
      <form
        onSubmit={login}
        className="flex flex-col justify-center items-center sm:mx-auto my-auto mx-4"
      >
        <h1 className="text-6xl font-semibold mb-4 animate-bounce">Login</h1>
        <p className="text-lg font-medium text-gray/75">Welcome back 🤗 </p>
        <p className="text-gray/60">
          Let's enter your account details to login to your account.
        </p>
        <hr className="border border-gray/50 w-full my-2" />
        <input
          type="text"
          placeholder="username"
          className="block w-full px-3 py-[0.4rem] rounded-lg border font-medium text-dark/75 mt-2 mb-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo sm:text-sm sm:leading-6 transition ease-in-out delay-150 focus:-translate-y-1 focus:scale-110 duration-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          pattern="[a-zA-Z]+"
          required
        />
        <input
          type="password"
          placeholder="password"
          className="block w-full px-3 py-[0.4rem] rounded-lg border font-medium text-dark/75 mb-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition ease-in-out delay-150 focus:-translate-y-1 focus:scale-110 duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          pattern="[a-zA-Z0-9]+"
          required
        />

        <button className={`shadow-lg shadow-gray/50 mb-5 w-full border border-gray ${isDarkMode ? "hover:border-gray/25" : "hover:border-gray/75"} rounded-xl px-4 py-2 bg-gray ${isDarkMode ? "hover:bg-gray/25" : "hover:bg-gray/75"} text-white font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}>
          {isLogging ? <CircularProgress size={20} color="inherit" /> : "Login"}
        </button>
        <p className="text-gray/75">
          Don't have an account yet?{" "}
          <Link to="/sign-up">
            <span className={`text-gray font-semibold ${isDarkMode ? "hover:text-white" : "hover:text-dark"}`}>
              👉🏽 Sign Up 👈🏽
            </span>
          </Link>
        </p>
      </form>
    </>
  );
};

export default Login;
