import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "../types";

interface Props {
  users: User[];
  onDelete: (userId: number) => void;
  onEdit: (user: User) => void;
}

// Definir estilos reutilizables para las celdas y el encabezado
const headerCellStyle = {
  backgroundColor: "#3454D1",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  borderBottom: "2px solid #fff",
};

const bodyCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  fontSize: "1rem",
};

function UserList({ users, onDelete, onEdit }: Props) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        height: "70vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#3454D1",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#2F4BC0", // Color cuando el scroll está en hover
        },
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="Lista de Usuarios">
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellStyle}>Nombre de Usuario</TableCell>
            <TableCell sx={headerCellStyle}>Editar</TableCell>
            <TableCell sx={headerCellStyle}>Eliminar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell sx={bodyCellStyle}>{user.username}</TableCell>
              <TableCell sx={bodyCellStyle} align="center">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(user)}
                  sx={{
                    transition: "all 0.3s ease",
                    backgroundColor: "#d84b20",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#c35b1f",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell sx={bodyCellStyle} align="center">
                <IconButton
                  color="error"
                  onClick={() => onDelete(user.id)}
                  sx={{
                    transition: "all 0.3s ease",
                    backgroundColor: "#C43145",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#a42f3a",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserList;
