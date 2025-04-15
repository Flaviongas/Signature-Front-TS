import logo from "../assets/signature.svg";
import { FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

type LoginProps = {
  onLoginSuccess: (token: string) => void;
  backLink: "https://signature.gidua.xyz" | "http://localhost:8000";
};
function Login({ onLoginSuccess, backLink }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("backLink:", backLink);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log({ username, password });
    try {
      // VOLVER ATRAS COMO ESTABA

      // const response = await fetch(`${backLink}/login`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ username, password }),
      // });
      const response = await fetch(`http://localhost:8000/login/`, {
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
      localStorage.setItem("Token", data.token);
      onLoginSuccess(data.token.toString());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputTextField = {
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
        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <img src={logo} alt="Logo" />
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={inputTextField}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={inputTextField}
          />

          {error && (
            <Alert
              severity="error"
              sx={{ my: 2, borderRadius: "0.5rem", textAlign: "center" }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
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
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
