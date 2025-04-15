import SubjectsGrid from "./SubjectsGrid";
import { Box } from "@mui/material";

function Dashboard() {
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <SubjectsGrid />
    </Box>
  );
}

export default Dashboard;
