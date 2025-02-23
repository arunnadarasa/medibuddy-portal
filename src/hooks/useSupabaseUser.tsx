import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseUser = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useSupabaseUser - Initial Fetch");

    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("Initial session:", session);

      if (session) {
        setUser(session.user);
      }

      setLoading(false);
    };

    fetchUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe(); // Cleanup on unmount
    };
  }, []);

  console.log("Returning user:", user);
  return { user, loading };
};
