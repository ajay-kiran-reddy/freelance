import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import DeploymentTable from "./DeploymentTable";
import { Grid2, InputAdornment, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import ConfigureDeployment from "./ConfigureDeployment";

export default function DeploymentDashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <ConfigureDeployment
        openDialog={openDialog}
        handleDialogClose={(value: boolean) => setOpenDialog(value)}
      />
      <Grid2 container spacing={3}>
        <Grid2 size={12}>
          <Card>
            <Grid2 container spacing={5}>
              <Grid2 size={6} textAlign="left">
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", padding: "0.5rem" }}
                >
                  Deployments
                </Typography>
              </Grid2>

              <Grid2 size={6} textAlign="right">
                <TextField
                  placeholder="Search"
                  size="small"
                  style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    },
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  style={{
                    marginRight: "0.5rem",
                    marginTop: "0.5rem",
                    color: "#F3BC00",
                  }}
                  onClick={() => setOpenDialog(true)}
                  color="secondary"
                >
                  Add New
                </Button>
              </Grid2>
            </Grid2>

            <CardContent>
              <DeploymentTable
                dataRefreshInd={openDialog}
                searchText={searchText}
              />
            </CardContent>
            <CardActions></CardActions>
          </Card>
        </Grid2>
      </Grid2>
    </>
  );
}
