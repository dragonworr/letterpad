import { Switch } from "antd";
import nextConfig from "next.config";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.theme || "light");

  useEffect(() => {
    if (localStorage.theme) {
      setTheme(localStorage.theme);
    }
    setTimeout(() => {
      switchTheme(localStorage.theme || theme);
    }, 0);
  }, []);

  const switchTheme = (color: string) => {
    ThemeSwitcher.switch(color);
    setTheme(color);
  };

  return (
    <div style={{ position: "absolute", bottom: "0px", padding: "20px" }}>
      <Switch
        checkedChildren="🔆"
        unCheckedChildren="☽"
        checked={theme === "dark"}
        size="small"
        onChange={checked => switchTheme(checked ? "dark" : "light")}
      />
    </div>
  );
};

ThemeSwitcher.switch = color => {
  const $theme = document.querySelector("#theme");
  if (color === "dark") {
    $theme?.setAttribute("href", `${nextConfig.basePath}/css/antd.dark.css`);
  } else {
    $theme?.setAttribute("href", `${nextConfig.basePath}/css/antd.css`);
  }
  localStorage.theme = color;
};
export default ThemeSwitcher;