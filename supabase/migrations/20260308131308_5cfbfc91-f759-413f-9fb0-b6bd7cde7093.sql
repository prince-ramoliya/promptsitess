
-- Track prompt copies per component
CREATE TABLE public.prompt_copies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id uuid NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_copies ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can insert their own copy events
CREATE POLICY "Users can insert own copy events" ON public.prompt_copies
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can read all copy events
CREATE POLICY "Admins can read all copy events" ON public.prompt_copies
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add is_read column to suggestions
ALTER TABLE public.suggestions ADD COLUMN is_read boolean NOT NULL DEFAULT false;

-- Enable realtime for prompt_copies
ALTER PUBLICATION supabase_realtime ADD TABLE public.prompt_copies;
