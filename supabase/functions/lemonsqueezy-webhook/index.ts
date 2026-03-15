import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const payload = JSON.parse(body);

    const eventName = payload.meta?.event_name;
    console.log("LemonSqueezy webhook received:", eventName);

    // Only process successful order events
    if (eventName !== "order_created") {
      console.log("Skipping event:", eventName);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderData = payload.data?.attributes;
    const customData = payload.meta?.custom_data || {};

    const userId = customData.user_id;
    if (!userId) {
      console.error("No user_id in custom data");
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only process paid orders
    if (orderData?.status !== "paid") {
      console.log("Order not paid, status:", orderData?.status);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const customerEmail = orderData.user_email || "";
    const customerName = orderData.user_name || "";
    const amount = orderData.total ? orderData.total / 100 : 0;
    const currency = orderData.currency?.toUpperCase() || "USD";

    // Check if purchase already exists for this user
    const { data: existing } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1);

    if (existing && existing.length > 0) {
      console.log("Purchase already exists for user:", userId);
      return new Response(JSON.stringify({ received: true, already_exists: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert new purchase record
    const { error: insertError } = await supabase
      .from("purchases")
      .insert({
        user_id: userId,
        user_email: customerEmail,
        user_name: customerName,
        amount,
        currency,
        status: "active",
        purchased_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Insert failed:", insertError);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Purchase recorded for user:", userId);

    return new Response(JSON.stringify({ received: true, user_id: userId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
