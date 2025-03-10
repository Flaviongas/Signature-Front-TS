import logo from '../assets/signature.svg'
import { FormEvent, useState } from "react";
import {
  Button,
} from "@chakra-ui/react";


type LoginProps = {
  onLoginSuccess: (token: string) => void;
  backLink: "https://signature.gidua.xyz" | "http://localhost:8000";
};
function Login({ onLoginSuccess, backLink }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log({ username, password })
    try {
      const response = await fetch(`${backLink}/login`, {
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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
    >
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-blue-400">
        <div className="mb-8 text-center ">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            <img src={logo} alt="logo" className="w-60 h-60 mx-auto my-2" />
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">

            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              required
            />

          </div>

          <div className="relative">

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            colorScheme='red'
            className="w-full text-white p-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-lg"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
