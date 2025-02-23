import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Agent requesting user data...");

    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 🚨 Extract `user_id` from the **URL path**
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/"); // Split by `/`
    const user_id = pathParts[pathParts.length - 1]; // Get the last part of the path

    if (!user_id) {
      throw new Error("Missing user_id in request URL path");
    }

    console.log(`Processing request for user_id: ${user_id}`);

    // 🚨 Authenticate the request using the Anon Key
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      throw new Error("Unauthorized: Missing Authorization header");
    }

    const jwt = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Authenticated user: ${user.id}`);

    // 🚨 Query user-related data
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError) {
      throw profileError;
    }

    return new Response(JSON.stringify({ userProfile }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message.includes("Unauthorized") ? 401 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
