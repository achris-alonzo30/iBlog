import "./App.css";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import UserContextProvider from "./context/UserContext";
import {
  PublicHome,
  UserHome,
  Login,
  Register,
  Post,
  CreatePost,
  EditPost,
} from "./pages/index";
import NoPost from "./components/NoPost";
import { useAuthEffect } from "./utils/auth";
import { UserContext } from "./context/UserContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

export default function App() {
  return (
    <UserContextProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </UserContextProvider>
  );
}

function AppContent() {
  const { setUserInfo } = useContext(UserContext);
  const { isDarkMode } = useTheme();

  // This is for when user has refreshed the page the user will stay login
  useAuthEffect(setUserInfo);

  return (
    <div className={`${isDarkMode ? 'bg-dark' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-dark'}`}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<PublicHome />} />
          <Route path="sign-in" element={<Login />} />
          <Route path="sign-up" element={<Register />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<UserHome />} />
          <Route path="/no-post" element={<NoPost />}/>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/edit/:id" element={<EditPost />} />
      
        </Route>
      </Routes>
    </div>
  );
}
