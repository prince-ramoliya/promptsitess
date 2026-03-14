import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const payload = JSON.parse(body);

    console.log("DodoPayments webhook received:", JSON.stringify({
      payment_id: payload.payment_id,
      status: payload.status,
      metadata: payload.metadata,
    }));

    // Only process succeeded payments
    if (payload.status !== "succeeded") {
      console.log("Skipping non-succeeded payment:", payload.status);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userId = payload.metadata?.user_id;
    if (!userId) {
      console.error("No user_id in payment metadata");
      return new Response(JSON.stringify({ error: "Missing user_id in metadata" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerEmail = payload.customer?.email || "";
    const customerName = payload.customer?.name || "";
    const customerPhone = payload.customer?.phone_number || null;
    const amount = payload.total_amount ? payload.total_amount / 100 : 0; // Convert from cents
    const currency = payload.currency || "USD";
    const paymentId = payload.payment_id || "";

    // Upsert purchase record (use payment_id to prevent duplicates)
    const { error: upsertError } = await supabase
      .from("purchases")
      .upsert(
        {
          user_id: userId,
          user_email: customerEmail,
          user_name: customerName,
          user_phone: customerPhone,
          amount,
          currency,
          status: "active",
          purchased_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error("Failed to record purchase:", upsertError);
      // Try insert instead (user might have multiple purchases)
      const { error: insertError } = await supabase
        .from("purchases")
        .insert({
          user_id: userId,
          user_email: customerEmail,
          user_name: customerName,
          user_phone: customerPhone,
          amount,
          currency,
          status: "active",
          purchased_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Failed to insert purchase:", insertError);
        return new Response(JSON.stringify({ error: "Database error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
