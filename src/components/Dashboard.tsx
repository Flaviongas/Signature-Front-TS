import SubjectsGrid from "./SubjectsGrid";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
interface Props {
  onDrawerToggle: () => void;
}
function Dashboard({ onDrawerToggle }: Props) {
  return (
    <Box display="flex" flexDirection="column" width="100%">
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onDrawerToggle}
        sx={{
          display: { md: "none" },
          ml: 2,
          width: "40px",
          height: "40px",
          alignSelf: "flex-start",
        }}
      >
        <MenuIcon />
      </IconButton>
      <SubjectsGrid />
    </Box>
  );
}

export default Dashboard;
