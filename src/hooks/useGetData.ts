import { useEffect, useState } from "react";

export default function useGetData<T>(url: string, refresh?: boolean) {
  const token = localStorage.getItem("Token");
  const [data, setdata] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    async function hook() {
      setLoading(true);
      try {
        const response = await fetch(url, {
          signal,
          headers: { Authorization: `Token ${token}` },
        });
        if (!response.ok) throw new Error(`${response.status}`);
        const data: T[] = await response.json();
        setdata(data);
        setError(undefined);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
    hook();

    return () => controller.abort();
  }, [refresh]);
  return { data, loading, error };
}
