
ALTER TABLE public.components ADD COLUMN is_trending boolean NOT NULL DEFAULT false;
ALTER TABLE public.components ADD COLUMN is_newest boolean NOT NULL DEFAULT false;
