/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import { DeploymentForm, initFormState, SnackBarProps } from "../../types";
import React from "react";
import SnackBar from "../common/SnackBar";

const ConfigureDeployment = ({
  openDialog,
  handleDialogClose,
  formData,
}: any) => {
  const [formState, setFormState] = useState<DeploymentForm>(initFormState);
  const today = dayjs();
  const [snakbarContent, setSnackbarContent] = React.useState<SnackBarProps>({
    message: "",
    open: false,
    severity: "success",
  });

  const handleFormChange = (event: any) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const hanldeDateChange = (date: any) => {
    setFormState({ ...formState, expDate: date.toString() });
  };

  const handleSave = () => {
    console.log(formState, "[formData]");
    if (!formState.id) {
      formState.id = new Date().getTime();
      const deployments = localStorage.getItem("deployments");
      let parsedDeployments = [];
      if (deployments) {
        parsedDeployments = JSON.parse(deployments) || [];
      }
      parsedDeployments = [...parsedDeployments, formState];
      localStorage.setItem("deployments", JSON.stringify(parsedDeployments));
    } else {
      const deployments = localStorage.getItem("deployments");
      let parsedDeployments = [];
      if (deployments) {
        parsedDeployments = JSON.parse(deployments) || [];
      }
      const targetIndex = parsedDeployments.findIndex(
        (data: DeploymentForm) => data.id === formState.id
      );
      console.log(parsedDeployments, "[parsedDeployments]");
      console.log(targetIndex, "[targetIndex]");
      parsedDeployments[targetIndex] = formState;
      localStorage.setItem("deployments", JSON.stringify(parsedDeployments));
    }
    setSnackbarContent({
      message: `Successfully saved the deployment ${formState?.name}`,
      open: true,
      severity: "success",
    });
    handleCancel();
  };

  const handleCancel = () => {
    setFormState(initFormState);
    handleDialogClose(false);
  };

  useEffect(() => {
    if (formData) setFormState(formData);
  }, [formData]);

  React.useEffect(() => {
    if (snakbarContent.open) {
      const timer = setTimeout(() => {
        setSnackbarContent({
          message: "",
          open: false,
          severity: "success",
        });
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [snakbarContent.open]);

  return (
    <>
      <SnackBar
        message={snakbarContent?.message}
        open={snakbarContent.open}
        severity={snakbarContent.severity}
      />
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={() => handleCancel()}
        open={openDialog}
      >
        <DialogTitle>Create Deployment</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={3}>
            <Grid2 size={12} style={{ marginTop: "0.5rem" }}>
              <TextField
                name="name"
                label="Deployment Name"
                fullWidth
                placeholder="Enter Deployment Name"
                onChange={handleFormChange}
                value={formState.name}
              />
            </Grid2>

            <Grid2 size={12}>
              <TextField
                name="authority"
                label="Authority"
                fullWidth
                placeholder="Enter Authority"
                onChange={handleFormChange}
                value={formState.authority}
              />
            </Grid2>

            <Grid2 size={12}>
              <TextField
                name="algorithm"
                label="Alogorithm"
                fullWidth
                placeholder="Enter Algorithm"
                onChange={handleFormChange}
                value={formState.algorithm}
              />
            </Grid2>

            <Grid2 size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem label="Expiration Date">
                  <DatePicker
                    defaultValue={today}
                    name="expDate"
                    disablePast
                    views={["year", "month", "day"]}
                    onChange={(date) => hanldeDateChange(date)}
                  />
                </DemoItem>
              </LocalizationProvider>
            </Grid2>

            <Grid2 size={12} textAlign="right">
              <Button
                style={{ marginRight: "0.5rem" }}
                color="secondary"
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default ConfigureDeployment;
