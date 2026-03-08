
-- Pricing config table (single row for current price)
CREATE TABLE public.pricing_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_price_usd numeric NOT NULL DEFAULT 19,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Discount codes table
CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer,
  current_uses integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Everyone can read pricing config
CREATE POLICY "Anyone can read pricing_config" ON public.pricing_config FOR SELECT USING (true);
-- Only admins can modify pricing config
CREATE POLICY "Admins can manage pricing_config" ON public.pricing_config FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can read active discount codes (for validation)
CREATE POLICY "Anyone can read active discounts" ON public.discount_codes FOR SELECT USING (true);
-- Only admins can manage discount codes
CREATE POLICY "Admins can manage discount_codes" ON public.discount_codes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.pricing_config;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discount_codes;

-- Insert default pricing row
INSERT INTO public.pricing_config (base_price_usd) VALUES (19);
