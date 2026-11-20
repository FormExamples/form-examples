-- set_updated_at() is a reusable trigger function that sets the updated_at
-- column to the current timestamp whenever a row is modified.
CREATE OR REPLACE FUNCTION rockall_score_for_upper_gastrointestinal_bleeding.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION rockall_score_for_upper_gastrointestinal_bleeding.set_updated_at() IS
    'Trigger function that sets updated_at to now() on every UPDATE.';
