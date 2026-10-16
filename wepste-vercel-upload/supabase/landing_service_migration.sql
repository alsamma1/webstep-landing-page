-- Editable landing page service content
CREATE TABLE IF NOT EXISTS public.landing_service_content (
  page_slug TEXT PRIMARY KEY CHECK (page_slug = 'services/landing'),
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.landing_service_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "landing_service_public_read" ON public.landing_service_content;
CREATE POLICY "landing_service_public_read" ON public.landing_service_content
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "landing_service_service_role_write" ON public.landing_service_content;
CREATE POLICY "landing_service_service_role_write" ON public.landing_service_content
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
GRANT SELECT ON public.landing_service_content TO anon, authenticated;
GRANT ALL ON public.landing_service_content TO service_role;
