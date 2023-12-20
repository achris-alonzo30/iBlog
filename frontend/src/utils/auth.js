import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function useAuthEffect(setUserInfo) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");

    if (!storedUserInfo) {
      const cookieUserInfo = getCookie("userInfo");
      if (cookieUserInfo) {
        const parsedUserInfo = JSON.parse(cookieUserInfo);

        // Check if the session is still valid
        const currentTime = new Date().getTime();
        if (parsedUserInfo && parsedUserInfo.expires * 1000 > currentTime) {
          setUserInfo(parsedUserInfo);
        } else {
          // Session has expired, so clear the cookie
          clearCookie("userInfo");
        }
      }
    } else {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    // Redirect to login only for private routes without valid authentication
    const isPrivateRoute =
      pathname.startsWith("/home") ||
      pathname.startsWith("/create") ||
      pathname.startsWith("/edit") ||
      pathname.startsWith("/post");
    const isAuthenticated =
      !!localStorage.getItem("userInfo") || !!getCookie("userInfo");

    if (isPrivateRoute && !isAuthenticated) {
      navigate("/sign-in");
    }
  }, [pathname, setUserInfo, navigate]);

  // Clear the cookie
  const clearCookie = (name, expirationMinutes = 0) => {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() - expirationMinutes);

    const formattedDate = expirationDate.toUTCString();
    document.cookie = `${name}=; expires=${formattedDate}; path=/;`;
  };
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
