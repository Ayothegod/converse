// src/ThemeToggle.js
import { useThemeContext } from "@/lib/hook/theme";

const ThemeToggle = () => {
  const { theme, setTheme, } = useThemeContext();

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <>
      <button
        className="p-2 bg-gray-200 dark:bg-black rounded"
        onClick={handleToggle}
      >
        {theme === "light"
          ? "Light Mode"
          : theme === "dark"
            ? "Dark Mode"
            : "System Mode"}
      </button>
    </>
  );
};

export default ThemeToggle;
