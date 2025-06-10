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
import { Student } from "../types";
import theme from "../theme.ts";
import { useState } from "react";

interface Props {
  students: Student[];
  onDelete: (studentId: number) => void;
  onEdit: (student: Student) => void;
}

// Definir estilos reutilizables para las celdas y el encabezado
const headerCellStyle = {
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
};

const bodyCellStyle = {
  padding: "16px",
  fontSize: "1rem",
  textAlign: "center",
  textTransform: "uppercase",
};

const hoverRowStyle = {
  "&:hover": {
    background: "rgba(0,0,0,0.05)",
  },
};

function StudentList({ students, onDelete, onEdit }: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const paginatedStudents = students.slice(
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
        <Table sx={{ minWidth: 650 }} aria-label="Lista de Estudiantes">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyle}>Nombre</TableCell>
              <TableCell sx={headerCellStyle}>Apellido</TableCell>
              <TableCell sx={headerCellStyle}>RUT</TableCell>
              <TableCell sx={headerCellStyle}>Editar</TableCell>
              <TableCell sx={headerCellStyle}>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={bodyCellStyle}>
                  No hay estudiantes registrados
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((student) => (
                <TableRow key={student.id} sx={hoverRowStyle}>
                  <TableCell sx={bodyCellStyle}>{student.first_name}</TableCell>
                  <TableCell sx={bodyCellStyle}>{student.last_name}</TableCell>
                  <TableCell sx={bodyCellStyle}>{student.rut}</TableCell>
                  <TableCell sx={bodyCellStyle} align="center">
                    <IconButton
                      onClick={() => onEdit(student)}
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
                      onClick={() => onDelete(student.id)}
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
      <Pagination
        shape="rounded"
        count={Math.ceil(students.length / rowsPerPage)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />
    </>
  );
}

export default StudentList;
