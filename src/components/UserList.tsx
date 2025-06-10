import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "../types";
import theme from "../theme.ts";
import { useState } from "react";

interface Props {
  users: User[];
  onDelete: (userId: number) => void;
  onEdit: (user: User) => void;
}

const headerCellStyle = {
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
};

const bodyCellStyle = {
  fontSize: "1rem",
};

const hoverRowStyle = {
  "&:hover": {
    background: "rgba(0,0,0,0.05)",
  },
};

function UserList({ users, onDelete, onEdit }: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const paginatedUsers = users.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={bodyCellStyle}>
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} sx={hoverRowStyle}>
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length > rowsPerPage && (
        <Pagination
          shape="rounded"
          count={Math.ceil(users.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      )}
    </>
  );
}

export default UserList;
