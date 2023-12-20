import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();
  return (
    <section className="flex mx-auto justify-center border-t-2 border-gray/50 w-full">
      <p className="my-2 text-gray/90">
        © Design By&nbsp;<span className={`font-bold ${isDarkMode ? "text-white" : "text-dark"}`}>Lonz</span>
      </p>
    </section>
  );
};

export default Footer;
