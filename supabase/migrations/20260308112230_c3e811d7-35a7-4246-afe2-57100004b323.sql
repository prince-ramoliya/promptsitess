
CREATE TABLE public.component_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  component_id UUID NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  UNIQUE(component_id, category_id)
);

ALTER TABLE public.component_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read component_categories" ON public.component_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage component_categories" ON public.component_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Migrate existing data from components.category_id
INSERT INTO public.component_categories (component_id, category_id)
SELECT id, category_id FROM public.components WHERE category_id IS NOT NULL;
