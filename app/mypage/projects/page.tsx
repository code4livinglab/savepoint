import React from "react";
import { AppBar } from "../../projects/_components/AppBar";
import UserProjectList from "./UserProjectList";
import { Box } from "@mui/material";

const MyProjectListPage = () => {
  return (
    <>
      <AppBar />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <UserProjectList />
      </Box>
    </>
  );
};

export default MyProjectListPage;
