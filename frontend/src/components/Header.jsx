import { useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import ThemeButton from "./ThemeButton";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const { isDarkMode } = useTheme();
  const { pathname } = useLocation();
  const creatingPost = pathname.startsWith("/create");
  const editingPost = pathname.startsWith("/edit");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      if (token) {
        try {
          const response = await fetch("http://localhost:4000/profile", {
            credentials: "include",
          });

          if (response.ok) {
            const userInfo = await response.json();
            setUserInfo(userInfo);
          } else {
            // Handle unauthorized or other errors
            console.error("Profile fetch failed:", response.statusText);
          }
        } catch (error) {
          console.error("Profile fetch failed:", error);
        }
      }
    };

    fetchUserProfile();
  }, [setUserInfo]);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful logout
        setUserInfo(null);

        // Clear the stored user information from local storage
        localStorage.removeItem("userInfo");

        // Navigate to the "/sign-in" route
        navigate("/sign-in");
      })
      .catch((error) => {
        // Handle fetch error
        console.error("Logout failed:", error);
      });
  }

  const username = userInfo?.username;

  const renderAuthLinks = () => {
    if (username) {
      return (
        <>
          <Link
            to={`${creatingPost ? "/home" : editingPost ? "/home" : "/create"}`}
            className={`md:text-lg text-sm hover:shadow-lg hover:shadow-gray/50 text-white border border-gray ${
              isDarkMode ? "hover:border-gray/25" : "hover:border-gray/75"
            } rounded-xl md:px-4 sm:px-2 px-1 sm:py-2 py-1 bg-gray ${
              isDarkMode ? "hover:bg-gray/25" : "hover:bg-gray/75"
            } transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}
          >
            {`${creatingPost ? "Home" : editingPost ? "Home" : "Create Post"}`}
          </Link>
          <button
            onClick={logout}
            className="hover:shadow-lg hover:shadow-gray/50 md:text-lg sm:text-md text-sm md:px-4 sm:px-2 px-1 sm:py-2 py-1 rounded-xl border border-dark hover:border-white hover:bg-white hover:text-dark transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link
            to="/sign-up"
            className={`md:text-lg hover:shadow-lg hover:shadow-gray/50 text-sm text-white border border-gray ${
              isDarkMode ? "hover:border-gray/25" : "hover:border-gray/75"
            } rounded-xl md:px-4 sm:px-2 px-1 sm:py-2 py-1 bg-gray ${
              isDarkMode ? "hover:bg-gray/25" : "hover:bg-gray/75"
            } transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}
          >
            Register
          </Link>
          <Link
            to="/sign-in"
            className={`md:text-lg text-sm text-md hover:shadow-lg hover:shadow-gray/50  border border-dark ${
              !isDarkMode && "hover:border-white"
            } hover:bg-white rounded-xl ${
              isDarkMode ? "text-white" : "text-dark"
            } hover:text-dark md:px-4 sm:px-2 px-1 sm:py-2 py-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}
          >
            Login
          </Link>
        </>
      );
    }
  };

  return (
    <header
      className={`flex justify-between items-center md:px-12 sm:px-6 px-3 md:py-6 py-3 border-b-2 ${
        isDarkMode ? "border-b-white/25" : "border-b-dark/25"
      }`}
    >
      <Link to="/" className="flex items-center gap-8">
        <h1 className="font-medium md:text-6xl sm:text-4xl text-xl">
          <span
            className={`font-bold ${isDarkMode ? "text-white" : "text-dark"}`}
          >
            B
          </span>
          <span className="text-gray">log</span>
        </h1>
      </Link>

      <nav className="flex gap-4 items-center">
        {renderAuthLinks()}
        <ThemeButton />
      </nav>
    </header>
  );
};

export default Header;
