--liquibase formatted sql

--changeset author:1
CREATE OR REPLACE FUNCTION objectives_and_key_results_tracker.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION IF EXISTS set_updated_at();

COMMENT ON FUNCTION objectives_and_key_results_tracker.set_updated_at() IS
    'Trigger function: set NEW.updated_at = now() on every row update.';
