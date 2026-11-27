-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_renal_transplant_recipient_request;

COMMENT ON SCHEMA medical_renal_transplant_recipient_request IS
    'Namespace for the Medical Renal Transplant Recipient Request form''s tables, functions and domains.';
