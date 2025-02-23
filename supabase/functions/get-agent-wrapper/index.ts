import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Read request body
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("Missing user_id in request.");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    if (!supabaseUrl) {
      throw new Error("Missing SUPABASE_URL environment variable");
    }

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
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
