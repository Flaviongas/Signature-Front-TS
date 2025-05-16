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
  import { Student } from "../types";
  import theme from "../theme.ts";

  
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
    borderBottom: "2px solid #fff",
  };
  
  const bodyCellStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    fontSize: "1rem",
  };
  
  function StudentList({ students, onDelete, onEdit }: Props) {

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
            backgroundColor: "#2F4BC0",
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
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell sx={bodyCellStyle}>{student.first_name}</TableCell>
                  <TableCell sx={bodyCellStyle}>{student.last_name}</TableCell>
                  <TableCell sx={bodyCellStyle}>{student.rut}</TableCell>
                  <TableCell sx={bodyCellStyle} align="center">
                    <IconButton
                      onClick={() => onEdit(student)}
                      sx={{
                        transition: "all 0.3s ease",
                        backgroundColor: "#f84b20",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#c35011",
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
    );
  }
  
  export default StudentList;