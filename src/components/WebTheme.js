import { createTheme, getContrastRatio } from "@mui/material/styles";

export default function WebTheme() {}

const darkThemeColors = {
  background: "#232323",
  text: "#fff",
};

export function getLoginTheme(isDarkMode) {
  const colors = isDarkMode ? darkThemeColors : {
    background: "#fff",
    text: "#111",
  };

  return createTheme({
    palette: {
      pmLoginTheme: {
        main: "#9723ef",
        lightMain: "#c27cf7",
        background: isDarkMode ? "#232323" : "#fff",
        text: isDarkMode? "#fff" : "#111",
        contrastText: getContrastRatio("#9723ef", colors.text) > 4.5 ? colors.text : colors.background,
      },
      mode: isDarkMode ? "dark" : "light", 
    },
  });
}
