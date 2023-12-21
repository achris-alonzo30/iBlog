import { useEffect, useState, useContext } from "react";
import Posts from "../../components/Posts";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const UserHome = () => {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch posts that match the current user's _id
    fetch(`${backendUrl}/post?author=${userInfo.id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((userPosts) => {
        // Check if there are posts before updating the state
        if (userPosts.length > 0) {
          setPosts(userPosts);
        } else {
          navigate("/no-post");
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [navigate, userInfo.id]);

  return (
    <section className="mx-auto my-auto">
      {posts.length !== 0 && (
        <h1 className="md:text-8xl text-6xl font-semibold text-center p-8">
          Featured Posts
        </h1>
      )}

      {posts.length !== 0 &&
        posts.map((post) => <Posts {...post} key={post.title} />)}
    </section>
  );
};

export default UserHome;
