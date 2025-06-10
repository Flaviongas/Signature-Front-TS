let BASE_URL: string;

const isTestEnv =
  typeof process !== "undefined" && process.env.JEST_WORKER_ID !== undefined;

if (isTestEnv) {
  // Solo lo usará Jest en entorno Node
  BASE_URL = process.env.VITE_API_URL || "http://localhost:8000";
} else {
  // Código para el navegador (Vite)
  BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
}

export { BASE_URL };
