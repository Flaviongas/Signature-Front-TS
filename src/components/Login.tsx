import logo from "../assets/signature.svg";
import { FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

type LoginProps = {
  onLoginSuccess: (token: string) => void;
  // backLink: "https://signature.gidua.xyz" | "http://localhost:8000";
  backLink: "http://localhost:8000" | "http://localhost:8000";
};

function LoginForm({ onLoginSuccess, backLink }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Maneja el envío del formulario de login
  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${backLink}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      // Guarda el token y notifica al componente padre
      localStorage.setItem("Token", data.token);
      localStorage.setItem("UserId", data.user.id.toString());
      onLoginSuccess(data.token.toString());
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputTextFieldStyles = {
    my: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "0.5rem",
      p: 1,
      backgroundColor: "white",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #FAF9F9, #FFD6BA)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: 4,
          borderRadius: "1rem",
          backgroundColor: "#5386E4",
        }}
      >
        {/* Logo centrado */}
        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <img src={logo} alt="Logo" />
        </Box>

        {/* Formulario de login */}
        <form onSubmit={handleLoginSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={inputTextFieldStyles}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={inputTextFieldStyles}
          />

          {/* Mensaje de error si el login falla */}
          {errorMessage && (
            <Alert
              severity="error"
              sx={{ my: 2, borderRadius: "0.5rem", textAlign: "center" }}
            >
              {errorMessage}
            </Alert>
          )}

          {/* Botón de envío con estado de carga */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              my: 2,
              p: 1,
              backgroundColor: "#D1495B",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "1rem",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#C43145",
              },
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginForm;
