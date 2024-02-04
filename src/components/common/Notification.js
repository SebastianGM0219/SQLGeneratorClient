import * as React from "react";
import { Alert, Snackbar } from "@mui/material";

export const notifyContents = {
  newConnectSuccess : "You connect to the database successfully.",
  newConnectFail: "You can't connect to the database.",
  runQuerySuccess : "Query run successfully.",
  runQueryFail : "Query run failed.",
  databaseSave: "Database saved successfully.",
  databaseDelete: "Database deleted successfully.",
  exportSuccess: "Result exported successfully.",
  queryCreateSuccess: "Query created successfully.",
  queryDeleteSuccess: "Query deleted successfully.",
  addTableDataSuccess: "Table added successfully.",
  createViewSuccess: "View created successfully",
  resetSuccess: "Table reset successfully",
  unionWarning: "Select queries to run union"
}


// export const Notification = ({isOpen, closeHandle, content}) => {
//     <Snackbar
//       open={isOpen}
//       sx={{ width: 500 }}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       autoHideDuration={2000}
//       onClose={closeHandle}
//     >
//     <Alert
//       onClose={closeHandle}
//       severity="error"
//       sx={{ width: "100%" }}
//     >
//       {content}
//     </Alert>
//   </Snackbar>
// }

// export default Notification