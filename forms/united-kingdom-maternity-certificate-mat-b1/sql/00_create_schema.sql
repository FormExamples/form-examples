-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_kingdom_maternity_certificate_mat_b1;

COMMENT ON SCHEMA united_kingdom_maternity_certificate_mat_b1 IS
    'Namespace for the United Kingdom Maternity Certificate MAT B1 form''s tables, functions and domains.';
