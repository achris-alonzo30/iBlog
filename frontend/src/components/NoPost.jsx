import { Link } from "react-router-dom";

const NoPost = () => {
  return (
    <div className="flex flex-col md:justify-center md:items-center my-auto sm:mx-auto mx-2">
      <span className="md:text-8xl sm:text-6xl text-4xl text-center animate-text-gradient">
        Be the first to share your unique story
      </span>
      <p className="md:text-8xl sm:text-6xl text-4xl text-center my-4">
        Start your journey here
      </p>
      <button className="mt-4 shadow-lg shadow-gray/50 border border-gray hover:border-gray/25 rounded-xl sm:px-4  px-2 sm:py-2 py-1 bg-gray hover:bg-gray/25 text-white md:text-2xl sm:text-xl text-md font-normal transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300">
        <Link to="/create">Create Your First Post</Link>
      </button>
    </div>
  );
};

export default NoPost;
