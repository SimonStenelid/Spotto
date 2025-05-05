-- Add last_summary_generated column to places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS last_summary_generated TIMESTAMP WITH TIME ZONE;

-- Create summary generation errors table
CREATE TABLE IF NOT EXISTS summary_generation_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  error_message TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_summary_generation_errors_place_id ON summary_generation_errors(place_id);
CREATE INDEX IF NOT EXISTS idx_summary_generation_errors_attempted_at ON summary_generation_errors(attempted_at); 