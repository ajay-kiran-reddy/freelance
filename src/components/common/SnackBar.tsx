import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { SnackBarProps } from "../../types";

export default function SimpleSnackbar(props: SnackBarProps) {
  const { message, open, severity } = props;

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000}>
        <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
