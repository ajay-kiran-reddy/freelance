/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeploymentForm {
  name: string;
  id?: number;
  authority: string;
  algorithm: string;
  expDate: string;
  children?: any;
}

interface SnackBarProps {
  open: boolean;
  message: string;
  severity: "error" | "success" | "info" | "warning";
}

const initFormState = {
  algorithm: "",
  authority: "",
  expDate: new Date().toString(),
  name: "",
  id: 0,
};

export type { DeploymentForm, SnackBarProps };

export { initFormState };
