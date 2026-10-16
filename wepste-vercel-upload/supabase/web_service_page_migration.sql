CREATE TABLE IF NOT EXISTS web_service_page_content (
  page_slug TEXT PRIMARY KEY DEFAULT 'services/web'
    CHECK (page_slug = 'services/web'),
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE web_service_page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "web_service_content_public_read" ON web_service_page_content;
CREATE POLICY "web_service_content_public_read"
  ON web_service_page_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "web_service_content_admin_write" ON web_service_page_content;
CREATE POLICY "web_service_content_admin_write"
  ON web_service_page_content FOR ALL USING (auth.role() = 'service_role');

GRANT SELECT ON web_service_page_content TO anon, authenticated;
GRANT ALL ON web_service_page_content TO service_role;
