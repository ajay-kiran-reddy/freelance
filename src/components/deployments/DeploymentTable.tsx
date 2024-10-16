/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { DeploymentForm, initFormState, SnackBarProps } from "../../types";
import { visuallyHidden } from "@mui/utils";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import ConfigureDeployment from "./ConfigureDeployment";
import SnackBar from "../common/SnackBar";
import CachedIcon from "@mui/icons-material/Cached";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const options = ["Promote", "Stage", "Trigger", "Schedule"];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "checkbox",
    numeric: false,
    disablePadding: true,
    label: "",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Deployment Id",
  },
  {
    id: "deploymentName",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "authority",
    numeric: true,
    disablePadding: false,
    label: "Authority",
  },
  {
    id: "algorithm",
    numeric: true,
    disablePadding: false,
    label: "Algorithm",
  },
  {
    id: "expDate",
    numeric: true,
    disablePadding: false,
    label: "Expiration Date",
  },
  {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

export default function DeploymentTable({ dataRefreshInd, searchText }: any) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRecord, setSelectedRecord] =
    React.useState<DeploymentForm>(initFormState);
  const [deleteRecord, setDeleteRecord]: any = React.useState({
    openDelete: false,
    data: null,
  });
  const [snakbarContent, setSnackbarContent] = React.useState<SnackBarProps>({
    message: "",
    open: false,
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const data = localStorage.getItem("deployments");
    if (data) {
      setRows(JSON.parse(data) || []);
    }
  }, [dataRefreshInd, openDialog]);

  const handleClick = (event: React.MouseEvent<unknown>, id: any) => {
    console.log(event);
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any
  ) => {
    console.log(event);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEdit = (row: DeploymentForm) => {
    setOpenDialog(true);
    setSelectedRecord(row);
  };

  const handleDelete = (data: DeploymentForm) => {
    setDeleteRecord({ openDelete: true, data: data });
  };

  const handleDeleteClose = () => {
    setDeleteRecord({ openDelete: false, data: null });
  };

  const handleDeleteCnf = () => {
    const deployments = localStorage.getItem("deployments");
    let parsedDeployments = [];
    if (deployments) {
      parsedDeployments = JSON.parse(deployments) || [];
    }
    parsedDeployments = parsedDeployments.filter(
      (data: DeploymentForm) => data.id !== deleteRecord?.data?.id
    );
    localStorage.setItem("deployments", JSON.stringify(parsedDeployments));
    handleDeleteClose();

    const updatedDeployments = localStorage.getItem("deployments");
    let updatedParsedDeployments = [];
    if (updatedDeployments) {
      updatedParsedDeployments = JSON.parse(updatedDeployments) || [];
    }

    setSnackbarContent({
      message: `Successfully deleted the deployment ${deleteRecord?.data?.name}`,
      open: true,
      severity: "success",
    });

    setRows(updatedParsedDeployments);
  };

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

  React.useEffect(() => {
    const deployments = localStorage.getItem("deployments");
    let parsedDeployments = [];
    if (deployments) {
      parsedDeployments = JSON.parse(deployments) || [];
    }
    if (searchText) {
      setRows(
        parsedDeployments.filter(
          (row: DeploymentForm) =>
            row?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            row?.algorithm?.toLowerCase().includes(searchText.toLowerCase()) ||
            row?.authority?.toLowerCase().includes(searchText.toLowerCase()) ||
            row?.expDate?.toLowerCase().includes(searchText.toLowerCase()) ||
            row?.algorithm?.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setRows(parsedDeployments);
    }
  }, [searchText]);

  return (
    <Box sx={{ width: "100%" }}>
      <SnackBar
        message={snakbarContent?.message}
        open={snakbarContent.open}
        severity={snakbarContent.severity}
      />
      <Dialog
        open={deleteRecord.openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Deployment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the deployment{" "}
            <strong>{deleteRecord?.data?.name}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCnf}
            autoFocus
            variant="contained"
            color="primary"
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <ConfigureDeployment
        openDialog={openDialog}
        handleDialogClose={(value: boolean) => setOpenDialog(value)}
        formData={selectedRecord}
      />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table aria-labelledby="tableTitle">
            <TableHead style={{ backgroundColor: "#3c3d3c" }}>
              <TableRow>
                {headCells.map((cell) => {
                  return (
                    <TableCell
                      padding={cell.disablePadding ? "none" : "normal"}
                      sortDirection={orderBy === cell.id ? order : false}
                      align="center"
                    >
                      <TableSortLabel
                        active={orderBy === cell.id}
                        direction={orderBy === cell.id ? order : "asc"}
                        onClick={createSortHandler(cell.id)}
                        style={{ color: "#F3BC00 !important" }}
                      >
                        <Typography color="primary">{cell.label}</Typography>
                        <Typography style={{ color: "red" }}>
                          {orderBy === cell.id ? (
                            <Box
                              style={{ color: "red" }}
                              component="span"
                              sx={visuallyHidden}
                            >
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows
                .sort(getComparator(order, orderBy))
                .map((row: DeploymentForm, index: number) => {
                  const labelId = `enhanced-table-checkbox-${row.id}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.authority}</TableCell>
                      <TableCell align="center">{row.algorithm}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.expDate}
                          color="secondary"
                          style={{ color: "#F3BC00" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {
                          <Box>
                            <Button
                              startIcon={<CachedIcon />}
                              variant="contained"
                              color="primary"
                            >
                              Renew
                            </Button>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEdit(row)}>
                                <Edit color="info" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDelete(row)}>
                                <Delete color="error" />
                              </IconButton>
                            </Tooltip>

                            <IconButton>
                              <FiberManualRecordIcon
                                color={index % 2 === 0 ? "success" : "warning"}
                              />
                            </IconButton>

                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={handleMenuClick}
                            >
                              <MoreVert />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              MenuListProps={{
                                "aria-labelledby": "long-button",
                              }}
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              slotProps={{
                                paper: {
                                  style: {
                                    maxHeight: 48 * 4.5,
                                    width: "20ch",
                                  },
                                },
                              }}
                            >
                              {options.map((option) => (
                                <MenuItem
                                  key={option}
                                  selected={option === "Pyxis"}
                                  onClick={handleClose}
                                >
                                  {option}
                                </MenuItem>
                              ))}
                            </Menu>
                          </Box>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
