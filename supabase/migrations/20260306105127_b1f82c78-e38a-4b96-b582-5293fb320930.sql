
-- Create storage bucket for component previews
INSERT INTO storage.buckets (id, name, public) VALUES ('component-previews', 'component-previews', true);

-- Allow anyone to view files
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'component-previews');

-- Allow admins to upload files
CREATE POLICY "Admins can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'component-previews' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete files
CREATE POLICY "Admins can delete" ON storage.objects FOR DELETE USING (bucket_id = 'component-previews' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update files
CREATE POLICY "Admins can update" ON storage.objects FOR UPDATE USING (bucket_id = 'component-previews' AND public.has_role(auth.uid(), 'admin'));
