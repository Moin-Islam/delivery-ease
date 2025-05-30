import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";


const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2C3532",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
