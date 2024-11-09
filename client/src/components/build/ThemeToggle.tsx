// src/ThemeToggle.js

import { useTheme } from "@/lib/hook/useTheme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  // console.log(theme);

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
      Hello
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



      {/* <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> */}
    </>
  );
};

export default ThemeToggle;
