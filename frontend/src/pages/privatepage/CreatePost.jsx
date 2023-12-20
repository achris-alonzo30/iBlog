import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState("");
  const [redirect, setRedirect] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { isDarkMode } = useTheme();

  async function postSubmit(event) {
    setIsCreatingPost(true);
    event.preventDefault();

    const postData = new FormData();
    postData.set("title", title);
    postData.set("summary", summary);
    postData.set("content", content);

    // Append the file to the FormData object
    if (file) {
      postData.append("file", file[0]);
    }

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: postData,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    setIsCreatingPost(false);
    return <Navigate to={"/"} />;
  }

  return (
    <section className="h-full my-auto max-w-screen-xl ms-[15%] me-[15%]">
      <h1 className="md:text-7xl text-4xl mb-4 text-center font-semibold animate-text-gradient">
        Create Your Post
      </h1>
      <form className="flex flex-col space-y-4" onSubmit={postSubmit}>
        <input
          className="block  w-full px-3 py-[0.4rem] rounded-lg border font-medium text-dark/75 mt-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo sm:text-sm sm:leading-6 transition ease-in-out delay-150 focus:-translate-y-1 focus:scale-105 duration-300"
          name="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="block  w-full px-3 py-[0.4rem] rounded-lg border font-medium text-dark/75 mt-2 mb-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo sm:text-sm sm:leading-6 transition ease-in-out delay-150 focus:-translate-y-1 focus:scale-105 duration-300"
          name="summary"
          type="text"
          placeholder="Subtitle"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <div className="flex flex-col justify-center items-center border border-dark bg-white/5 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 mt-4">
            <span>📸</span> Upload Image <span>📸</span>
          </h2>

          <input
            type="file"
            name="file"
            className="flex py-2 px-2 font-medium cursor-pointer text-sm
            file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-gray file:text-white
            hover:file:bg-gray/25 mb-4 ml-16"
            onChange={(e) => setFile(e.target.files)}
            required
          />
        </div>

        <ReactQuill
          theme="snow"
          name="content"
          onChange={(newValue) => setContent(newValue)}
          required
        />
        <button
          type="submit"
          className={`shadow-lg text-lg shadow-gray/50 mb-5 w-full border border-gray ${isDarkMode ? "hover:border-gray/25" : "hover:border-gray/75" } rounded-xl px-4 py-2 bg-gray ${isDarkMode ? "hover:bg-gray/25" : "hover:bg-gray/75" } text-white font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300`}
        >
          {isCreatingPost ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
