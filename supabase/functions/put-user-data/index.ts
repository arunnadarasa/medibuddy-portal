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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read request body
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("Missing user_id in request.");
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError) throw profileError;

    // Fetch prescriptions linked to user
    const { data: prescriptions, error: prescriptionError } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("patient_id", user_id);

    if (prescriptionError) throw prescriptionError;

    // Fetch refill requests linked to prescriptions
    const prescriptionIds = prescriptions.map((p) => p.id);

    const { data: refillRequests, error: refillError } = await supabase
      .from("refill_requests")
      .select("*")
      .in("prescription_id", prescriptionIds);

    if (refillError) throw refillError;

    return new Response(
      JSON.stringify({
        profile,
        prescriptions,
        refillRequests,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Function error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
