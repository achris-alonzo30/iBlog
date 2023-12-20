import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivateRoute = () => {
  const { userInfo } = useContext(UserContext);

  return userInfo ? (
    <main className="flex flex-col max-w-full min-h-screen">
      <Header />
      <Outlet />     
      <Footer />
    </main>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
