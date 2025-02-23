import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Agent requesting user data...");

    // 🚨 Require POST Method (GET won't have a request body)
    if (req.method !== "POST") {
      throw new Error("Invalid request method. Use POST instead.");
    }

    // 🚨 Extract Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Missing Bearer token");
    }

    const jwt = authHeader.replace("Bearer ", "");

    // 🚨 Validate the Bearer token using Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables are missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(jwt);

    if (error || !user) {
      throw new Error("Unauthorized: Invalid JWT token.");
    }

    console.log(`Authenticated user: ${user.id}`);

    // 🚨 Read request body
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("Missing user_id in request.");
    }

    console.log(`Processing request for user_id: ${user_id}`);

    // Call `put-user-data` securely using a service role key
    const response = await fetch(`${supabaseUrl}/functions/v1/put-user-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`, // Secure internal call
      },
      body: JSON.stringify({ user_id }),
    });

    const userData = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to get user data: ${userData.error}`);
    }

    return new Response(
      JSON.stringify(userData),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
        }
      }
    );

  } catch (error) {
    console.error("Function error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message.includes("Unauthorized") ? 401 : 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
