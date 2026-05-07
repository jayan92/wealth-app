import { useState } from "react";
import { toast } from "sonner";

const useFetch = <T>(cb: (...args: any[]) => Promise<T>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]): Promise<T | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
      return response;
    } catch (err) {
      const e = err as Error;
      setError(e);
      toast.error(e.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
