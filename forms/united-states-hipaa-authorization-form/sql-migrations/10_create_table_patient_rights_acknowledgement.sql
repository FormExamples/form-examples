-- Patient acknowledgement of HIPAA-required statements.

CREATE TABLE patient_rights_acknowledgement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    acknowledged_right_to_revoke VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (acknowledged_right_to_revoke IN ('', 'yes', 'no')),
    acknowledged_revocation_procedure VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (acknowledged_revocation_procedure IN ('', 'yes', 'no')),
    acknowledged_no_conditioning VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (acknowledged_no_conditioning IN ('', 'yes', 'no')),
    acknowledged_redisclosure_warning VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (acknowledged_redisclosure_warning IN ('', 'yes', 'no')),
    acknowledged_right_to_copy VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (acknowledged_right_to_copy IN ('', 'yes', 'no')),
    acknowledged_right_to_inspect_disclosed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (acknowledged_right_to_inspect_disclosed IN ('', 'yes', 'no'))
);

CREATE TRIGGER trigger_patient_rights_acknowledgement_updated_at
    BEFORE UPDATE ON patient_rights_acknowledgement
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient_rights_acknowledgement IS
    'Patient acknowledgement of HIPAA-required statements. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(2).';
COMMENT ON COLUMN patient_rights_acknowledgement.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient_rights_acknowledgement.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient_rights_acknowledgement.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN patient_rights_acknowledgement.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN patient_rights_acknowledgement.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN patient_rights_acknowledgement.acknowledged_right_to_revoke IS
    'Patient acknowledged the right to revoke the authorization in writing per § 164.508(c)(2)(i): yes, no, or empty.';
COMMENT ON COLUMN patient_rights_acknowledgement.acknowledged_revocation_procedure IS
    'Patient acknowledged the procedure for revocation and any exceptions: yes, no, or empty.';
COMMENT ON COLUMN patient_rights_acknowledgement.acknowledged_no_conditioning IS
    'Patient acknowledged that treatment, payment, enrolment, or eligibility are not conditioned on signing per § 164.508(c)(2)(ii): yes, no, or empty.';
COMMENT ON COLUMN patient_rights_acknowledgement.acknowledged_redisclosure_warning IS
    'Patient acknowledged the potential for the disclosed information to be re-disclosed and no longer protected per § 164.508(c)(2)(iii): yes, no, or empty.';
COMMENT ON COLUMN patient_rights_acknowledgement.acknowledged_right_to_copy IS
    'Patient acknowledged the right to receive a copy of the signed authorization per § 164.508(c)(4): yes, no, or empty.';
COMMENT ON COLUMN patient_rights_acknowledgement.acknowledged_right_to_inspect_disclosed IS
    'Patient acknowledged the right to inspect and copy the information that is disclosed: yes, no, or empty.';
