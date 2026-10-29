import { useEffect, useState } from "react";
import { supabase, type Service } from "./supabase";

export function useServices() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("sort")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setServices(data as Service[]);
      });
  }, []);

  return { services, error };
}
