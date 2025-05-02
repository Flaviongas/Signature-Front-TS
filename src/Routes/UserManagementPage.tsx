import { Box, Typography, Container, Button } from "@mui/material";
import CreateUserModal from "../components/UserModal";
import UserList from "../components/UserList";
import { useEffect, useState } from "react";
import { User } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../services/userService";

function UserManagementPage() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = () => {
    getUsers()
      .then((res) => {
        console.log("Datos obtenidos de la API:", res.data);
        setUsers(res.data);
      })

      .catch((err) => console.error("Error al obtener usuarios:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setIsOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      console.log("Usuario eliminado con éxito.");
    } catch (error) {
      console.error("Error eliminando el usuario:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#EFEFEF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 24,
            left: 0,
            display: { xs: "none", sm: "block" },
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              textTransform: "none",
              ml: 3,
              bgcolor: "#3454D1",
              "&:hover": {
                bgcolor: "#2F4BC0",
              },
            }}
          >
            Volver
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
            Gestión de Usuarios
          </Typography>

          <Button
            variant="contained"
            sx={{
              my: 5,
              bgcolor: "#3454D1",
              "&:hover": {
                bgcolor: "#2F4BC0",
              },
            }}
            onClick={() => {
              setEditUser(null);
              setIsOpen(true);
            }}
          >
            Crear Usuario
          </Button>
          <CreateUserModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onUserCreated={fetchUsers}
            userToEdit={editUser}
          />

          <UserList
            users={users.filter((user) => !user.is_superuser)}
            onDelete={handleDeleteUser}
            onEdit={handleEditUser}
          />
        </Box>
      </Container>
    </Box>
  );
}

export default UserManagementPage;
