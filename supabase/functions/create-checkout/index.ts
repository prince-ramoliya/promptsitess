import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LEMONSQUEEZY_PRODUCT_ID = "0a5c0ecb-bc33-4b2d-9bb7-13e43f11f8b3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { return_url } = await req.json();

    // Build LemonSqueezy checkout URL with user metadata and success redirect
    const baseUrl = `https://promptsites.lemonsqueezy.com/checkout/buy/${LEMONSQUEEZY_PRODUCT_ID}`;
    const checkoutUrl = new URL(baseUrl);
    checkoutUrl.searchParams.set("checkout[custom][user_id]", user.id);
    checkoutUrl.searchParams.set("checkout[email]", user.email || "");

    // Set the success redirect URL back to our app
    const successUrl = return_url || `${req.headers.get("origin") || "https://promptsitess.lovable.app"}/payment-success`;
    checkoutUrl.searchParams.set("checkout[success_url]", successUrl);

    return new Response(
      JSON.stringify({ checkout_url: checkoutUrl.toString() }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
