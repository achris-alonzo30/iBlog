import { useTheme } from "../context/ThemeContext";

const ThemeButton = () => {
  const { toggleDarkMode, isDarkMode } = useTheme();

  return (
    <button onClick={toggleDarkMode} className="hover:shadow-lg hover:shadow-gray/50 md:text-lg sm:text-md text-sm md:px-4 sm:px-2 px-1 sm:py-2 py-1 rounded-xl border border-dark hover:border-white transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </button>

  );
};

export default ThemeButton;
