-- set_updated_at() is a reusable trigger function that sets the updated_at
-- column to the current timestamp whenever a row is modified.
CREATE OR REPLACE FUNCTION medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.set_updated_at() IS
    'Trigger function that sets updated_at to now() on every UPDATE.';
