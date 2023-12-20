import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/utils";
import { useTheme } from "../../context/ThemeContext";

export default function Post() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id]);

  if (!postInfo) return null;

  return (
    <div className="container mx-auto sm:my-8 my-2 sm:p-16 p-4 lg:w-2/3 space-y-4">
      {userInfo.id === postInfo.author._id && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="md:text-6xl text-2xl truncate font-bold">
              {postInfo.title}
            </h1>

            <button
              className={`md:text-lg text-sm text-white border border-gray ${
                isDarkMode ? "hover:border-gray/25" : "hover:border-gray/75"
              } rounded-xl md:px-4 sm:px-2 px-1 sm:py-2 py-1 bg-gray ${
                isDarkMode ? "hover:bg-gray/25" : "hover:bg-gray/75"
              } transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}
            >
              <Link
                className=" text-white font-semibold px-2"
                to={`/edit/${postInfo._id}`}
              >
                Edit
              </Link>
            </button>
          </div>

          <hr className="w-full border-b border-gray/50" />

          <div className="flex justify-between text-gray-600 mb-4 text-gray/90">
            @{postInfo.author.username}
            <time className="text-gray-500 block mb-2">
              {formatDate(postInfo.createdAt)}
            </time>
          </div>

          <div className="image mb-4">
            <img
              className="w-full md:h-96 h-64 object-cover"
              src={`http://localhost:4000/${postInfo.file}`}
              alt=""
            />
          </div>

          <div
            className={`"${isDarkMode ? "text-white/75" : "text-dark/75" }text-justify sm:text-lg text-sm`}
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />
        </>
      )}
    </div>
  );
}
