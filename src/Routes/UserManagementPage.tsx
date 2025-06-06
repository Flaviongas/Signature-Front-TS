import { Box, Typography, Container, Button } from "@mui/material";
import CreateUserModal from "../components/UserModal";
import UserList from "../components/UserList";
import { useEffect, useState } from "react";
import { User } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../services/userService";
import UploadModal from "../components/UploadModal";
import TemplateButton from "../components/TemplateButton";

const templateData = [
  {
    Usuario: "Solo letras y números (eliminar esta fila)",
    Contraseña: "Más de 8 carácteres, una mayúscula y un número  (eliminar esta fila)",
    Nombre_Carrera: "Nombre de la carrera (eliminar esta fila)",
    Codigo_Carrera: "Código de la carrera (eliminar esta fila)",
  },
  {
    Usuario: "Ejemplo: Pedro",
    Contraseña: "Ejemplo: Pedro1234",
    Nombre_Carrera: "Ingeniería Civil Industrial",
    Codigo_Carrera: "ICIND_111",
  },
];

function UserManagementPage() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = () => {
    getUsers()
      .then((res) => {
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
      if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
        return;
      }
      const reponse = await deleteUser(userId);

      if (reponse.status === 200 || reponse.status === 204) {
        setUsers((prevUsers) => {
          const userIndex = prevUsers.findIndex((u) => u.id === userId);
          if (userIndex !== -1) {
            const updatedUsers = [...prevUsers];
            updatedUsers.splice(userIndex, 1);
            return updatedUsers;
          }
          return prevUsers;
        })
      } else {
        console.error("Error al eliminar el usuario:", reponse);
      }
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
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              textTransform: "none",
              ml: 3,
              fontWeight: "bold",
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

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            gap: 2,
            my: 5,
          }}>

            <Button
              variant="contained"
              color="secondary"
              sx={{
                fontWeight: "bold",
              }}
              onClick={() => {
                setEditUser(null);
                setIsOpen(true);
              }}
            >
              Crear Usuario
            </Button>

            <Button
              variant="contained"
              color="info"
              sx={{
                fontWeight: "bold",
              }}
              onClick={() => {
                setIsUserModalOpen(true);
              }}
            >
              Subir CSV con Usuarios
            </Button>
            <TemplateButton filename={"Plantilla para crear usuarios"} data={templateData} />
          </Box>
          <UploadModal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSomethingCreated={fetchUsers} uploadText="usuarios" route="uploadUserCSV/" />
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
      </Container >
    </Box >
  );
}

export default UserManagementPage;
