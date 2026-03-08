
-- Allow admins to delete suggestions
CREATE POLICY "Admins can delete suggestions" ON public.suggestions
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update suggestions (mark as read)
CREATE POLICY "Admins can update suggestions" ON public.suggestions
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
