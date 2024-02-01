import * as React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { initAllState } from "../../slices/query";
import { initAllUtility } from "../../slices/utility";
import { initAllDatabaseTable } from "../../slices/database";
import { initAllTable } from "../../slices/table";
import { saveDbInformation } from "../../slices/database";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Cookies from "js-cookie";
import { getTables, addUpdateItem } from "../../slices/table";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar, Alert } from "@mui/material";
import { faL } from "@fortawesome/free-solid-svg-icons";
import DialogContentText from "@mui/material/DialogContentText";
const CustomTextField = styled(TextField)(({ theme }) => ({
  fontSize: 12,
  marginTop: 1,
  // pointerEvents: 'none',
  "& .MuiInputBase-input": {
    height: 0,
    fontSize: 14,
  },
  "& .MuiInputLabel-root": {
    fontSize: 14,
    transform: "translate(14px, 9px) scale(1)",
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  fontSize: 14,
  height: 25,
  // margin: 4,
  paddingLeft: 25,
  paddingRight: 25,
  paddingTop: 18,
  paddingBottom: 15,
  textAlign: "center",
}));

const CustomSelect = styled(Select)(({ theme }) => ({
  fontSize: 14, // Set the width based on the 'width' prop
  height: "35px",
  "& .MuiInputBase-input": {
    height: 0,
    fontSize: 14,
  },
  "& .MuiInputLabel-root": {
    fontSize: 12,
    transform: "translate(14px, 19px) scale(1)",
  },
}));

const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: "14px",
  marginTop: 12,
}));

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export default function NewConnection({ open, handleClose, handleConnect, isLoading }) {
  const sessionDbInfos = Cookies.get("dbInfos");
  const initialDbInfosArray = sessionDbInfos ? JSON.parse(sessionDbInfos) : [];
  const initialDbInfos =
    initialDbInfosArray && initialDbInfosArray[0]
      ? initialDbInfosArray[0]
      : {
          host: "",
          username: "",
          password: "",
          port: "",
          db: "",
        };
  // let flag = 0;
  let index_flag = 0;
  const dispatch = useDispatch();
  const [saveDisable, setSaveDisable] = useState(true);
  const [flag, setFlag] = useState(0);
  const [duplicateAlert, setDuplicateAlert] = useState(false);
  const [dbInfos, setDbInfos] = useState(initialDbInfos);
  const [newButtonOpen, setNewButtonOpen] = useState(false);
  const [newName, setNewName] = useState("New Connection");
  const [index, setIndex] = useState(0);
  const initmenu = initialDbInfosArray
  ? initialDbInfosArray.map((item) => item.connectname)
  : [];
  const [connectMenu, setConnectMenu] = useState(initmenu);
  const [selectedName, setSelectedName] = useState("");
  const [error, setError] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);
  const [openAlertSave, setOpenAlertSave] = React.useState(false);
  const [saveSnackOpen, setSaveSnackOpen] = React.useState(false);
  const [deleteSnackOpen, setDeleteSnackOpen] = React.useState(false);
  const [disableParam, setDisableParam] = React.useState(
    initmenu.length > 0 ? false : true
  );

  useEffect(() => {
    setDisableParam(connectMenu.length > 0 ? false : true);
  }, [connectMenu]);

  useEffect(() => {
    setSaveDisable(false);
  }, [dbInfos, flag]);
  const changeNameHandler = (e) => {
    setNewName(e.target.value);
    //  setDbInfos({...dbInfos, [e.target.name]: e.target.value})
  };

  const changeHandler = (e) => {
    setDbInfos({ ...dbInfos, [e.target.name]: e.target.value });
  };

  const isUserNameValid = (url) => dbInfos.username === "";

  const isHostValid = (url) => dbInfos.host === "";

  const isPasswordValid = (url) => dbInfos.password === "";

  const isPortValid = (url) => dbInfos.port === "";

  const isDbValid = (url) => dbInfos.db === "";

  const handleClick = (e) => {
    if (
      isUserNameValid() ||
      isHostValid() ||
      isPasswordValid() ||
      isPortValid() ||
      isDbValid()
    ) {
      setError(true);
    } else {
      const newvalue = {
        ...dbInfos,
        connectname: selectedName,
      };

      let found = false;
      let newArray = initialDbInfosArray.map((item) => {
        if (item.connectname === newvalue.connectname) {
          found = true;
          return newvalue; // Update the array with the new value
        }
        return item;
      });
      console.log(found);
      if (!found) {
        newArray.push(newvalue); // If not found, push new value to array
      }

      //      setSaveSnackOpen(true);
      Cookies.set("dbInfos", JSON.stringify(newArray), { expires: 30 });
      //    Cookies.set('dbInfos', JSON.stringify(newArray), { expires: 30 });

      dispatch(initAllDatabaseTable());
      dispatch(saveDbInformation({ dbInfo: dbInfos }));
      dispatch(getTables());
      dispatch(initAllState());
      dispatch(initAllUtility());
      dispatch(initAllTable());
      handleConnect(dbInfos);
      setOpenAlertSave(false);

      setFlag(0);
      //       }
      //       else
      //       {
      // //        setOpenAlertSave(true);
      //       }
      //      setSaveOpen(open);
      //      setSaveSnackOpen(false);
    }
  };

  const closeDuplicateAlert = () => {
    setDuplicateAlert(false);
  };
  const handleSaveClose = () => {
    setSaveSnackOpen(false);
  };
  const handleDeleteClose = () => {
    setDeleteSnackOpen(false);
  };

  const closeAgreeAlertSave = () => {
    // setSelectedName(index_flag);
    // setIndex(index_flag);
    // setDbInfos(initialDbInfosArray[index_flag]);
    // setOpenAlertSave(false);
    // setFlag(0);
    const newvalue = {
      ...dbInfos,
      connectname: selectedName,
    };

    let found = false;
    let newArray = initialDbInfosArray.map((item) => {
      if (item.connectname === newvalue.connectname) {
        found = true;
        return newvalue; // Update the array with the new value
      }
      return item;
    });
    if (!found) {
      newArray.push(newvalue); // If not found, push new value to array
    }
    //      setSaveSnackOpen(true);
    Cookies.set("dbInfos", JSON.stringify(newArray), { expires: 30 });
    //    Cookies.set('dbInfos', JSON.stringify(newArray), { expires: 30 });

    dispatch(initAllDatabaseTable());
    dispatch(saveDbInformation({ dbInfo: dbInfos }));
    dispatch(getTables());
    dispatch(initAllState());
    dispatch(initAllUtility());
    dispatch(initAllTable());
    handleConnect(dbInfos);
    setOpenAlertSave(false);
    setFlag(0);
  };

  const closeDisAgreeAlertSave = () => {
    // setSelectedName(0);
    // setIndex(0);
    // setDbInfos(initialDbInfosArray[0]);
    // setOpenAlertSave(false);
    // const updatedMenu = connectMenu.filter((_, index) => index !== initialDbInfosArray.length);
    // setConnectMenu(updatedMenu);

    dispatch(initAllDatabaseTable());
    dispatch(saveDbInformation({ dbInfo: dbInfos }));
    dispatch(getTables());
    dispatch(initAllState());
    dispatch(initAllUtility());
    dispatch(initAllTable());
    handleConnect(dbInfos);
    setOpenAlertSave(false);
    setFlag(0);
  };

  const closeEmpty = () => {
    setEmpty(false);
  };

  const handleNewDailog = () => {
    // console.log("hereee=============e");
    setNewName("New Connection");
    if (flag === 1 && connectMenu.length > 0) {
      setOpenAlertSave(true);
    } else setNewButtonOpen(true);
  };

  const handleCloseNewDailog = () => {
    setNewButtonOpen(false);
  };

  const handleOkayNewDailog = () => {
    if (newName.trim() === "") {
      setEmpty(true);
      return;
    }
    if (!connectMenu.some((value) => value === newName)) {
      setConnectMenu((prevMenu) => [...prevMenu, newName]);
      setSelectedName(newName);
      setIndex(connectMenu.length);
      const dbInfo_new = {
        username: "postgres",
        host: "localhost",
        port: "5432",
        password: "password",
        db: "",
      };
      setDbInfos(dbInfo_new);
      setNewButtonOpen(false);

      setFlag(1);
      setSaveDisable(true);
    } else {
      setDuplicateAlert(true);
    }
  };

  const handleMenuChange = (event) => {
    setSaveDisable(true);
    if (flag === 1) {
      index_flag = event.target.value;
      setOpenAlertSave(true);
    } else {
      index_flag = event.target.value;
      setSelectedName(connectMenu[event.target.value]);
      setIndex(event.target.value);
      setDbInfos(initialDbInfosArray[event.target.value]);
    }
  };

  const handleDeleteNewDailog = () => {
    initialDbInfosArray.splice(index, 1);
    const updatedConnectMenu = [...connectMenu];
    updatedConnectMenu.splice(index, 1); // Remove one element starting at index 2
    setConnectMenu(updatedConnectMenu);

    if (initialDbInfosArray.length == 0) {
      const initialDbInfos = {
        host: "",
        username: "",
        password: "",
        port: "",
        db: "",
      };
      setIndex(0);
      setDbInfos(initialDbInfos);
    } else {
      setIndex(initialDbInfosArray.length - 1);
      setDbInfos(initialDbInfosArray[initialDbInfosArray.length - 1]);
    }

    Cookies.set("dbInfos", JSON.stringify(initialDbInfosArray), {
      expires: 30,
    });
    setDeleteSnackOpen(true);
  };

  const handleSaveNewDailog = () => {
    if (
      isUserNameValid() ||
      isHostValid() ||
      isPasswordValid() ||
      isPortValid() ||
      isDbValid()
    ) {
      setError(true);
    } else {
      setFlag(0);
      const newvalue = {
        ...dbInfos,
        connectname: selectedName,
      };

      let found = false;
      let newArray = initialDbInfosArray.map((item) => {
        if (item.connectname === newvalue.connectname) {
          found = true;
          return newvalue; // Update the array with the new value
        }
        return item;
      });
      if (!found) {
        newArray.push(newvalue); // If not found, push new value to array
      }
      //      setSaveSnackOpen(true);
      Cookies.set("dbInfos", JSON.stringify(newArray), { expires: 30 });
      setSaveDisable(true);
      setSaveSnackOpen(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"xs"}
      PaperProps={{ style: { width: 600, padding: 20 } }}
      sx={{opacity:isLoading ? 0.8: 1}}
    >
      <CustomDialogTitle sx={{ marginLeft: "3px" }}>
        Connect to PostgreSQL Host
        <IconButton edge="end" color="inherit" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </CustomDialogTitle>

      <DialogContent width={600}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <CustomButton
            variant="outlined"
            sx={{ marginLeft: "2px" }}
            onClick={handleNewDailog}
          >
            New
          </CustomButton>
          <Dialog
            PaperProps={{ style: { width: 400, padding: 20 } }}
            open={newButtonOpen}
            onClose={handleCloseNewDailog}
            disableRestoreFocus
          >
            <DialogTitle>New Connection</DialogTitle>
            <DialogContent>
              <CustomTextField
                value={newName}
                onChange={changeNameHandler}
                type="text"
                fullWidth
                variant="outlined"
                autoFocus
              />
            </DialogContent>
            <DialogActions sx={{display:'block', padding:'4px 24px'}}>
              <Button onClick={handleCloseNewDailog} variant="contained" sx={{float: 'right'}}>
                Close
              </Button>
              <Button
                onClick={handleOkayNewDailog}
                variant="contained" sx={{float: 'right', marginRight: '15px'}}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <CustomButton
            onClick={handleSaveNewDailog}
            disabled={disableParam || saveDisable}
            variant="outlined"
          >
            Save
          </CustomButton>
          <CustomButton
            variant="outlined"
            disabled={disableParam}
            onClick={handleDeleteNewDailog}
          >
            Delete
          </CustomButton>
        </div>
        <div style={{ alignItems: "center", paddingLeft: "4px" }}>
          <CustomInputLabel id="saved-connection-label">
            Saved Connection
          </CustomInputLabel>
          <FormControl variant="outlined" fullWidth>
            <CustomSelect
              disabled={disableParam}
              placeholder="Host Address"
              labelId="saved-connection-label"
              value={index}
              defaultValue={index}
              onChange={handleMenuChange}
            >
              {connectMenu.map((item, index) => (
                <MenuItem key={index} value={index}>
                  {item}
                </MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
          <CustomInputLabel id="saved-connection-label">
            Host Address
          </CustomInputLabel>
          <CustomTextField
            autoFocus
            disabled={disableParam}
            value={dbInfos?.host}
            name="host"
            placeholder=""
            type="text"
            error={error && isHostValid()}
            helperText={
              error && isHostValid() ? "You have to input Username" : ""
            }
            fullWidth
            variant="outlined"
            onChange={changeHandler}
          />
          <CustomInputLabel id="saved-connection-label">
            Username
          </CustomInputLabel>
          <CustomTextField
            name="username"
            disabled={disableParam}
            value={dbInfos?.username}
            // placeholder="Username"
            error={error && isUserNameValid()}
            helperText={
              error && isUserNameValid() ? "You have to input Username" : ""
            }
            type="text"
            fullWidth
            variant="outlined"
            onChange={changeHandler}
          />
          <CustomInputLabel id="saved-connection-label">
            Password
          </CustomInputLabel>
          <CustomTextField
            type="password"
            name="password"
            disabled={disableParam}
            // placeholder="Password"
            value={dbInfos?.password}
            error={error && isPasswordValid()}
            helperText={
              error && isPasswordValid() ? "You have to input Username" : ""
            }
            fullWidth
            variant="outlined"
            onChange={changeHandler}
          />
          <CustomInputLabel id="saved-connection-label">Port</CustomInputLabel>
          <CustomTextField
            name="port"
            value={dbInfos?.port}
            disabled={disableParam}
            // placeholder="Port"
            type="text"
            error={error && isPortValid()}
            helperText={
              error && isPortValid() ? "You have to input Username" : ""
            }
            fullWidth
            variant="outlined"
            onChange={changeHandler}
          />
          <CustomInputLabel id="saved-connection-label">
            DataBase Name
          </CustomInputLabel>
          <CustomTextField
            disabled={disableParam}
            name="db"
            // placeholder="Database Name"
            type="text"
            value={dbInfos?.db}
            error={error && isDbValid()}
            helperText={
              error && isDbValid() ? "You have to input Username" : ""
            }
            fullWidth
            variant="outlined"
            onChange={changeHandler}
          />
        </div>
      </DialogContent>
      <DialogActions sx={{ display: "block", padding: "4px 24px" }}>
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={handleClick}
        >
          Connect
        </Button>
        <Button
          variant="contained"
          sx={{ float: "right", marginRight: "15px" }}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </DialogActions>

      <Snackbar
        open={saveSnackOpen}
        sx={{ width: 500 }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
        onClose={handleSaveClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Database saved correctly.
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleteSnackOpen}
        sx={{ width: 500 }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={2000}
        onClose={handleDeleteClose}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          Database deleted correctly.
        </Alert>
      </Snackbar>

      <Dialog
        open={empty}
        // onClose={closeAlertSave}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Connection Name is Empty! Input connection name correctly!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEmpty} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAlertSave}
        // onClose={closeAlertSave}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"POSTSQL Professional"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You've changed your connection Details. Do you want to save changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDisAgreeAlertSave}>Disagree</Button>
          <Button onClick={closeAgreeAlertSave} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={duplicateAlert}
        // onClose={closeAlertSave}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"POSTSQL Professional"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Connection already exists, Please enter a unique name
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDuplicateAlert}>Okay</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
