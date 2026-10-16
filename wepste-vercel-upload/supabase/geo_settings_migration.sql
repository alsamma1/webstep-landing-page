-- =====================================================================
-- Migration: Geo-Targeting & Regional Localization (Yemen & Saudi/Global)
-- Table: site_settings -> key: 'geo_settings'
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure RLS is enabled
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public reads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'site_settings' AND policyname = 'Public site settings read'
    ) THEN
        CREATE POLICY "Public site settings read" 
        ON public.site_settings FOR SELECT 
        USING (true);
    END IF;
END $$;

-- Allow service_role writes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'site_settings' AND policyname = 'Service role write site settings'
    ) THEN
        CREATE POLICY "Service role write site settings" 
        ON public.site_settings FOR ALL 
        USING (true) 
        WITH CHECK (true);
    END IF;
END $$;

-- Insert or update geo_settings
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
    'geo_settings',
    '{
        "defaultRegion": "sa",
        "yemen": {
            "phone": "771111357",
            "phoneFormatted": "+967 771 111 357",
            "whatsapp": "967771111357",
            "email": "alsmh655@gmail.com",
            "currency": "ر.ي",
            "currencyName": "ريال يمني",
            "address": "صنعاء، الجمهورية اليمنية",
            "city": "صنعاء",
            "countryName": "اليمن",
            "flag": "🇾🇪"
        },
        "saudi": {
            "phone": "+966593672193",
            "phoneFormatted": "+966 59 367 2193",
            "whatsapp": "966593672193",
            "email": "hello@wepstep.com",
            "currency": "ر.س",
            "currencyName": "ريال سعودي",
            "address": "الرياض، المملكة العربية السعودية",
            "city": "الرياض",
            "countryName": "السعودية والعالم",
            "flag": "🇸🇦"
        },
        "pricing": {
            "yerExchangeRate": 450,
            "customPackagePrices": {
                "landing_starter": { "sar": 1200, "yer": 540000 },
                "landing_pro": { "sar": 2200, "yer": 990000 },
                "web_starter": { "sar": 2500, "yer": 1125000 },
                "web_business": { "sar": 4500, "yer": 2025000 },
                "web_enterprise": { "sar": 8500, "yer": 3825000 },
                "apps_mvp": { "sar": 6500, "yer": 2925000 },
                "apps_pro": { "sar": 12500, "yer": 5625000 },
                "ecommerce_starter": { "sar": 3500, "yer": 1575000 },
                "ecommerce_growth": { "sar": 6500, "yer": 2925000 },
                "design_identity": { "sar": 1800, "yer": 810000 },
                "design_uiux": { "sar": 3200, "yer": 1440000 }
            }
        },
        "images": {
            "heroBadge": {
                "ye": "حلول رقمية متقدمة في اليمن وبأفضل الأسعار",
                "sa": "حلول رقمية عصرية وذكية للسوق السعودي والخليجي"
            },
            "heroLogo": {
                "ye": "/assets/logo/logo.png",
                "sa": "/assets/logo/logo.png"
            },
            "heroStage1": {
                "ye": "/assets/1.png",
                "sa": "/assets/1.png"
            },
            "heroStage2": {
                "ye": "/assets/2.png",
                "sa": "/assets/2.png"
            },
            "heroStage3": {
                "ye": "/assets/3.png",
                "sa": "/assets/3.png"
            },
            "aboutImage": {
                "ye": "/assets/logo/logo.png",
                "sa": "/assets/logo/logo.png"
            },
            "featuresImage": {
                "ye": "/assets/logo/logo.png",
                "sa": "/assets/logo/logo.png"
            },
            "contactImage": {
                "ye": "/assets/logo/logo.png",
                "sa": "/assets/logo/logo.png"
            }
        },
        "social": {
            "instagram": "https://instagram.com/wepstep",
            "twitter": "https://twitter.com/wepstep",
            "linkedin": "https://linkedin.com/company/wepstep"
        },
        "siteUrl": "https://wepstep.com"
    }'::jsonb,
    NOW()
)
ON CONFLICT (key) DO UPDATE
SET 
    value = EXCLUDED.value,
    updated_at = NOW();
