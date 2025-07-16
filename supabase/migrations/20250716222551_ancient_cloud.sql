/*
  # Add cancellation reason to claims table
  
  1. Changes
    - Add cancellation_reason column to claims table
    
  2. Purpose
    - Allow storing reason when a claim is cancelled
*/

-- Add cancellation_reason column to claims table
ALTER TABLE IF EXISTS claims 
ADD COLUMN IF NOT EXISTS cancellation_reason text;