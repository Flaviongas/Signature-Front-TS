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
import theme from "../theme.ts";

interface Props {
  users: User[];
  onDelete: (userId: number) => void;
  onEdit: (user: User) => void;
}


// Definir estilos reutilizables para las celdas y el encabezado
const headerCellStyle = {
  backgroundColor: theme.palette.secondary.main,
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
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          width: "5px",
          height: "5px", 
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.secondary.main,
          borderRadius: "10px",
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
                  onClick={() => onEdit(user)}
                  sx={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                    backgroundColor: theme.palette.info.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.info.dark,

                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell sx={bodyCellStyle} align="center">
                <IconButton
                  onClick={() => onDelete(user.id)}
                  sx={{
                    borderRadius: "8px",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
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
