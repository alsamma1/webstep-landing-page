-- =====================================================================
-- Migration: Notifications System (WebStep Admin)
-- Connects orders, contact messages, career requests, and comments.
-- =====================================================================

-- 1. Ensure site_settings table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Initialize notification tracking keys if not present
INSERT INTO public.site_settings (key, value, updated_at)
VALUES 
  ('admin_read_notifications', '[]'::jsonb, now()),
  ('admin_dismissed_notifications', '[]'::jsonb, now())
ON CONFLICT (key) DO NOTHING;

-- 3. Ensure orders table has proper status values and index
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
    END IF;
END $$;

-- 4. Ensure messages table has read column and index
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages (read);
        CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at DESC);
    END IF;
END $$;
