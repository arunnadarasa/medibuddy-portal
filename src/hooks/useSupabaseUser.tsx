import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseUser = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useSupabaseUser");
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user); // Store the user object
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
};
