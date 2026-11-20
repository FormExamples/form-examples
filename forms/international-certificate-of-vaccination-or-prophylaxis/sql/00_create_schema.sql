-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS international_certificate_of_vaccination_or_prophylaxis;

COMMENT ON SCHEMA international_certificate_of_vaccination_or_prophylaxis IS
    'Namespace for the International Certificate of Vaccination or Prophylaxis (ICVP) form''s tables, functions and domains.';
