import { Grid } from "@material-ui/core";
import Gurd from "components/guard/Gurd";

export default function Custom404() {
  return (
    <Gurd>
      <Grid container direction="column" justify="center" alignItems="center">
        <h1>404 | Page Not Found</h1>
        <h2>Redirecting to Login...</h2>
      </Grid>
    </Gurd>
  );
}
