-- Dedicated editable content tables for ecommerce, SaaS/systems, digital marketing, and support.
DO $$
DECLARE service_name TEXT;
BEGIN
  FOREACH service_name IN ARRAY ARRAY['ecommerce', 'systems', 'marketing', 'support']
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS public.%I (
        service_key TEXT PRIMARY KEY CHECK (service_key = %L),
        content JSONB NOT NULL DEFAULT ''{}''::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )',
      service_name || '_service_content',
      service_name
    );
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', service_name || '_service_content');
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      service_name || '_service_public_read',
      service_name || '_service_content'
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT USING (true)',
      service_name || '_service_public_read',
      service_name || '_service_content'
    );
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      service_name || '_service_service_role_write',
      service_name || '_service_content'
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (auth.role() = ''service_role'') WITH CHECK (auth.role() = ''service_role'')',
      service_name || '_service_service_role_write',
      service_name || '_service_content'
    );
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', service_name || '_service_content');
    EXECUTE format('GRANT ALL ON public.%I TO service_role', service_name || '_service_content');
    EXECUTE format(
      'INSERT INTO public.%I (service_key, content) VALUES (%L, ''{}''::jsonb) ON CONFLICT (service_key) DO NOTHING',
      service_name || '_service_content',
      service_name
    );
  END LOOP;
END $$;
