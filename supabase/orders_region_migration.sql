-- Migration: Add region column to orders table
-- Run this in the Supabase SQL Editor

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'global' CHECK (region IN ('ye', 'sa', 'global'));

-- Update existing orders with no region to 'global'
UPDATE orders SET region = 'global' WHERE region IS NULL;

COMMENT ON COLUMN orders.region IS 'Geographic region of the order: ye=Yemen, sa=Saudi Arabia, global=other countries';
