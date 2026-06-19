-- schema.sql
-- Combined schema for form: united-states-hipaa-authorization-form
--
-- Auto-generated. Do not edit by hand.
--
-- Source files (15):
--   - 00_extensions.sql
--   - 01_create_function_set_updated_at.sql
--   - 02_create_table_patient.sql
--   - 03_create_table_hipaa_authorization.sql
--   - 04_create_table_signer.sql
--   - 05_create_table_disclosing_source.sql
--   - 06_create_table_authorized_recipient.sql
--   - 07_create_table_records_to_disclose.sql
--   - 08_create_table_purpose_of_disclosure.sql
--   - 09_create_table_expiration.sql
--   - 10_create_table_patient_rights_acknowledgement.sql
--   - 11_create_table_signature_witness.sql
--   - 12_create_table_validation_result.sql
--   - 13_create_table_validation_fired_rule.sql
--   - 14_create_table_validation_additional_flag.sql


-- ========================================================================
-- BEGIN 00_extensions.sql
-- ========================================================================

-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========================================================================
-- END 00_extensions.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 01_create_function_set_updated_at.sql
-- ========================================================================

-- set_updated_at() is a reusable trigger function that sets the updated_at
-- column to the current timestamp whenever a row is modified.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_updated_at() IS
    'Trigger function that sets updated_at to now() on every UPDATE.';

-- ========================================================================
-- END 01_create_function_set_updated_at.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 02_create_table_patient.sql
-- ========================================================================

-- Patient identification fields for the HIPAA authorization form.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE,
    social_security_number VARCHAR(11) NOT NULL DEFAULT '',
    street_address TEXT NOT NULL DEFAULT '',
    city VARCHAR(120) NOT NULL DEFAULT '',
    state VARCHAR(2) NOT NULL DEFAULT '',
    zip_code VARCHAR(10) NOT NULL DEFAULT '',
    phone VARCHAR(30) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient identification fields for the HIPAA authorization form.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when this row was deleted (soft-delete).';
COMMENT ON COLUMN patient.name IS
    'Patient print name, as it appears on the signed authorization.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth. Required by 45 CFR § 164.508(c)(1)(vi) for identity-binding the signature.';
COMMENT ON COLUMN patient.social_security_number IS
    'Social Security Number, optional. State templates such as TN HS-2557 mark this as "not required". Format NNN-NN-NNNN.';
COMMENT ON COLUMN patient.street_address IS
    'Street address line.';
COMMENT ON COLUMN patient.city IS
    'City.';
COMMENT ON COLUMN patient.state IS
    'US state two-letter abbreviation (e.g. TN, PA, CA).';
COMMENT ON COLUMN patient.zip_code IS
    'US ZIP code (5 or 9 digit).';
COMMENT ON COLUMN patient.phone IS
    'Phone number including area code.';
COMMENT ON COLUMN patient.email IS
    'Email address, optional.';

-- ========================================================================
-- END 02_create_table_patient.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 03_create_table_hipaa_authorization.sql
-- ========================================================================

-- Parent entity for a single HIPAA authorization document.

CREATE TABLE hipaa_authorization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL
        REFERENCES patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'valid', 'invalid', 'expired', 'revoked')),
    state_template VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (state_template IN ('', 'tn-hs-2557', 'pa-hs-1549', 'hhs-ocr-sample', 'custom')),
    revoked_at TIMESTAMPTZ,
    revocation_method VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (revocation_method IN ('', 'written', 'electronic', 'in-person'))
);

CREATE TRIGGER trigger_hipaa_authorization_updated_at
    BEFORE UPDATE ON hipaa_authorization
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hipaa_authorization IS
    'Parent entity for a single HIPAA authorization document. Every other section table is a one-to-one or one-to-many child.';
COMMENT ON COLUMN hipaa_authorization.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hipaa_authorization.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hipaa_authorization.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN hipaa_authorization.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN hipaa_authorization.patient_id IS
    'Foreign key to the patient who is authorising the disclosure.';
COMMENT ON COLUMN hipaa_authorization.status IS
    'Lifecycle status: draft, submitted, valid, invalid, expired, or revoked.';
COMMENT ON COLUMN hipaa_authorization.state_template IS
    'Source state template the authorization was generated from. Empty when not derived from a known template.';
COMMENT ON COLUMN hipaa_authorization.revoked_at IS
    'Timestamp when the patient revoked the authorization (NULL if not revoked).';
COMMENT ON COLUMN hipaa_authorization.revocation_method IS
    'Method of revocation: written, electronic, in-person, or empty if not revoked.';

-- ========================================================================
-- END 03_create_table_hipaa_authorization.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 04_create_table_signer.sql
-- ========================================================================

-- Identification of the individual who signs the authorization.

CREATE TABLE signer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    relationship VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (relationship IN (
            '',
            'self',
            'parent-of-minor',
            'guardian',
            'conservator',
            'power-of-attorney',
            'executor',
            'other-authorized-representative'
        )),
    representative_name VARCHAR(255) NOT NULL DEFAULT '',
    representative_authority_description TEXT NOT NULL DEFAULT '',
    representative_authority_proof_attached VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (representative_authority_proof_attached IN ('', 'yes', 'no'))
);

CREATE TRIGGER trigger_signer_updated_at
    BEFORE UPDATE ON signer
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE signer IS
    'Identification of the individual who signs the HIPAA authorization. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(vi).';
COMMENT ON COLUMN signer.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN signer.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN signer.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN signer.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN signer.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN signer.relationship IS
    'Signer relationship to patient: self, parent-of-minor, guardian, conservator, power-of-attorney, executor, other-authorized-representative, or empty if unanswered.';
COMMENT ON COLUMN signer.representative_name IS
    'Print name of the authorized representative (empty when relationship is self).';
COMMENT ON COLUMN signer.representative_authority_description IS
    'Free-text description of the representative''s authority to act. Required by § 164.508(c)(1)(vi)(B) when signed by a representative.';
COMMENT ON COLUMN signer.representative_authority_proof_attached IS
    'Whether proof of legal authority is attached (e.g. POA, guardianship order): yes, no, or empty.';

-- ========================================================================
-- END 04_create_table_signer.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 05_create_table_disclosing_source.sql
-- ========================================================================

-- The person(s) or class of persons authorized to make the disclosure.

CREATE TABLE disclosing_source (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    identification_mode VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (identification_mode IN ('', 'specific', 'class')),
    specific_persons_or_organizations TEXT NOT NULL DEFAULT '',
    class_description TEXT NOT NULL DEFAULT '',
    is_va_facility VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_va_facility IN ('', 'yes', 'no')),
    is_part_2_program VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_part_2_program IN ('', 'yes', 'no'))
);

CREATE TRIGGER trigger_disclosing_source_updated_at
    BEFORE UPDATE ON disclosing_source
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE disclosing_source IS
    'Person(s) or class of persons authorized to make the disclosure. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(ii).';
COMMENT ON COLUMN disclosing_source.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN disclosing_source.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN disclosing_source.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN disclosing_source.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN disclosing_source.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN disclosing_source.identification_mode IS
    'Whether the disclosing source is identified specifically or as a class: specific, class, or empty.';
COMMENT ON COLUMN disclosing_source.specific_persons_or_organizations IS
    'Free-text list of the specific persons or organizations holding the records. Used when identification_mode is specific.';
COMMENT ON COLUMN disclosing_source.class_description IS
    'Free-text description of the class of persons (e.g. "doctors, hospitals, clinics, nursing homes, …"). Used when identification_mode is class.';
COMMENT ON COLUMN disclosing_source.is_va_facility IS
    'Whether the disclosing source is a US Department of Veterans Affairs facility: yes, no, or empty. Triggers the 38 U.S.C. § 7332 rule when yes.';
COMMENT ON COLUMN disclosing_source.is_part_2_program IS
    'Whether the disclosing source is a federally assisted substance-use-disorder program subject to 42 CFR Part 2: yes, no, or empty.';

-- ========================================================================
-- END 05_create_table_disclosing_source.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 06_create_table_authorized_recipient.sql
-- ========================================================================

-- The person(s) or class of persons to whom the disclosure may be made.

CREATE TABLE authorized_recipient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL DEFAULT '',
    recipient_organization VARCHAR(255) NOT NULL DEFAULT '',
    recipient_role VARCHAR(255) NOT NULL DEFAULT '',
    recipient_address TEXT NOT NULL DEFAULT '',
    recipient_phone VARCHAR(30) NOT NULL DEFAULT '',
    recipient_email VARCHAR(255) NOT NULL DEFAULT '',
    recipient_relationship_to_patient VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (recipient_relationship_to_patient IN (
            '',
            'health-plan',
            'state-agency',
            'employer',
            'attorney',
            'researcher',
            'family-member',
            'self',
            'health-care-provider',
            'other'
        ))
);

CREATE TRIGGER trigger_authorized_recipient_updated_at
    BEFORE UPDATE ON authorized_recipient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE authorized_recipient IS
    'Person(s) or class of persons to whom the disclosure may be made. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(iii).';
COMMENT ON COLUMN authorized_recipient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN authorized_recipient.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN authorized_recipient.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN authorized_recipient.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN authorized_recipient.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN authorized_recipient.recipient_name IS
    'Full name of the authorized recipient (individual or organisation contact).';
COMMENT ON COLUMN authorized_recipient.recipient_organization IS
    'Organisation the recipient belongs to (e.g. "Tennessee Department of Human Services").';
COMMENT ON COLUMN authorized_recipient.recipient_role IS
    'Professional role or title of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_address IS
    'Postal address of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_phone IS
    'Phone number of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_email IS
    'Email address of the recipient.';
COMMENT ON COLUMN authorized_recipient.recipient_relationship_to_patient IS
    'Recipient relationship: health-plan, state-agency, employer, attorney, researcher, family-member, self, health-care-provider, other, or empty.';

-- ========================================================================
-- END 06_create_table_authorized_recipient.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 07_create_table_records_to_disclose.sql
-- ========================================================================

-- Specific and meaningful description of the PHI to be disclosed.

CREATE TABLE records_to_disclose (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,

    include_medical_health VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (include_medical_health IN ('', 'yes', 'no')),
    medical_health_initials VARCHAR(8) NOT NULL DEFAULT '',

    include_mental_health VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (include_mental_health IN ('', 'yes', 'no')),
    mental_health_initials VARCHAR(8) NOT NULL DEFAULT '',

    include_substance_use VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (include_substance_use IN ('', 'yes', 'no')),
    substance_use_initials VARCHAR(8) NOT NULL DEFAULT '',
    part2_redisclosure_notice_included VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (part2_redisclosure_notice_included IN ('', 'yes', 'no')),

    include_hiv_aids VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (include_hiv_aids IN ('', 'yes', 'no')),
    hiv_aids_initials VARCHAR(8) NOT NULL DEFAULT '',
    hiv_aids_state_consent_included VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (hiv_aids_state_consent_included IN ('', 'yes', 'no')),

    include_psychotherapy_notes VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (include_psychotherapy_notes IN ('', 'yes', 'no')),
    include_genetic_information VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (include_genetic_information IN ('', 'yes', 'no')),
    include_reproductive_health VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (include_reproductive_health IN ('', 'yes', 'no')),

    section_7332_notice_included VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (section_7332_notice_included IN ('', 'yes', 'no')),

    date_range_specified VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (date_range_specified IN ('', 'yes', 'no')),
    date_from DATE,
    date_to DATE,
    other_description TEXT NOT NULL DEFAULT '',

    CHECK (date_to IS NULL OR date_from IS NULL OR date_to >= date_from)
);

CREATE TRIGGER trigger_records_to_disclose_updated_at
    BEFORE UPDATE ON records_to_disclose
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE records_to_disclose IS
    'Specific and meaningful description of the PHI to be disclosed. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(i).';
COMMENT ON COLUMN records_to_disclose.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN records_to_disclose.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN records_to_disclose.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN records_to_disclose.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN records_to_disclose.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN records_to_disclose.include_medical_health IS
    'Include general medical / health records: yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.medical_health_initials IS
    'Patient initials authorising release of general medical / health records.';
COMMENT ON COLUMN records_to_disclose.include_mental_health IS
    'Include mental-health records: yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.mental_health_initials IS
    'Patient initials authorising release of mental-health records.';
COMMENT ON COLUMN records_to_disclose.include_substance_use IS
    'Include drug or alcohol treatment / referral records: yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.substance_use_initials IS
    'Patient initials authorising release of substance-use records.';
COMMENT ON COLUMN records_to_disclose.part2_redisclosure_notice_included IS
    'Whether the 42 CFR Part 2 prohibition-on-redisclosure notice is included with the disclosure: yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.include_hiv_aids IS
    'Include HIV / AIDS test or treatment records: yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.hiv_aids_initials IS
    'Patient initials authorising release of HIV / AIDS records.';
COMMENT ON COLUMN records_to_disclose.hiv_aids_state_consent_included IS
    'Whether the state-specific HIV / AIDS consent language is included: yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.include_psychotherapy_notes IS
    'Include psychotherapy notes: yes, no, or empty. § 164.508(a)(2) requires these to be authorised on a separate form.';
COMMENT ON COLUMN records_to_disclose.include_genetic_information IS
    'Include genetic information: yes, no, or empty. Subject to GINA downstream-use restrictions.';
COMMENT ON COLUMN records_to_disclose.include_reproductive_health IS
    'Include reproductive-health-care records: yes, no, or empty. Subject to the HHS 2024 reproductive-health-privacy rule.';
COMMENT ON COLUMN records_to_disclose.section_7332_notice_included IS
    'Whether the 38 U.S.C. § 7332 notice is included (for VA records): yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.date_range_specified IS
    'Whether the patient has restricted disclosure to a specific date range: yes, no, or empty.';
COMMENT ON COLUMN records_to_disclose.date_from IS
    'Start date of the disclosed records (NULL if no date range).';
COMMENT ON COLUMN records_to_disclose.date_to IS
    'End date of the disclosed records (NULL if no date range). Must be >= date_from when both are set.';
COMMENT ON COLUMN records_to_disclose.other_description IS
    'Free-text description of any other PHI to be disclosed. Required to be specific enough to satisfy § 164.508(c)(1)(i).';

-- ========================================================================
-- END 07_create_table_records_to_disclose.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 08_create_table_purpose_of_disclosure.sql
-- ========================================================================

-- Description of each purpose of the requested use or disclosure.

CREATE TABLE purpose_of_disclosure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    purposes TEXT[] NOT NULL DEFAULT '{}',
    primary_purpose VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_purpose IN (
            '',
            'eligibility-determination',
            'continuing-treatment',
            'insurance-claim',
            'legal-proceeding',
            'disability-application',
            'personal-use',
            'research',
            'employment',
            'at-the-request-of-the-individual',
            'other'
        )),
    other_details TEXT NOT NULL DEFAULT '',
    CHECK (primary_purpose != 'other' OR other_details <> '')
);

CREATE TRIGGER trigger_purpose_of_disclosure_updated_at
    BEFORE UPDATE ON purpose_of_disclosure
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE purpose_of_disclosure IS
    'Description of each purpose of the requested use or disclosure. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(iv).';
COMMENT ON COLUMN purpose_of_disclosure.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN purpose_of_disclosure.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN purpose_of_disclosure.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN purpose_of_disclosure.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN purpose_of_disclosure.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN purpose_of_disclosure.purposes IS
    'Array of purpose identifiers (multiple purposes are permitted).';
COMMENT ON COLUMN purpose_of_disclosure.primary_purpose IS
    'Primary purpose: eligibility-determination, continuing-treatment, insurance-claim, legal-proceeding, disability-application, personal-use, research, employment, at-the-request-of-the-individual, other, or empty.';
COMMENT ON COLUMN purpose_of_disclosure.other_details IS
    'Free-text details when primary_purpose is other. Must not be empty when primary_purpose is other.';

-- ========================================================================
-- END 08_create_table_purpose_of_disclosure.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 09_create_table_expiration.sql
-- ========================================================================

-- Expiration date or expiration event for the authorization.

CREATE TABLE expiration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    kind VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (kind IN ('', 'date', 'event', 'duration')),
    expiration_date DATE,
    expiration_event TEXT NOT NULL DEFAULT '',
    duration_months INTEGER,
    duration_label VARCHAR(80) NOT NULL DEFAULT '',
    CHECK (duration_months IS NULL OR duration_months > 0),
    CHECK (expiration_event !~* '^(none|n/a)$')
);

CREATE TRIGGER trigger_expiration_updated_at
    BEFORE UPDATE ON expiration
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE expiration IS
    'Expiration date or expiration event for the authorization. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(v); the string "none" is not permitted (except for research).';
COMMENT ON COLUMN expiration.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expiration.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expiration.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expiration.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN expiration.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN expiration.kind IS
    'Expiration mechanism: date, event, duration, or empty if unanswered.';
COMMENT ON COLUMN expiration.expiration_date IS
    'Calendar expiration date (used when kind is date).';
COMMENT ON COLUMN expiration.expiration_event IS
    'Free-text expiration event (e.g. "upon conclusion of my claim"). Used when kind is event. Cannot be the string "none".';
COMMENT ON COLUMN expiration.duration_months IS
    'Validity duration in months from signature (e.g. 12). Used when kind is duration.';
COMMENT ON COLUMN expiration.duration_label IS
    'Human-readable duration label (e.g. "12 months from signature").';

-- ========================================================================
-- END 09_create_table_expiration.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 10_create_table_patient_rights_acknowledgement.sql
-- ========================================================================

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

-- ========================================================================
-- END 10_create_table_patient_rights_acknowledgement.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 11_create_table_signature_witness.sql
-- ========================================================================

-- Signature, date, and (where applicable) witness fields.

CREATE TABLE signature_witness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,

    individual_signature_confirmed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (individual_signature_confirmed IN ('', 'yes', 'no')),
    individual_signature_image_uri TEXT NOT NULL DEFAULT '',
    signature_date DATE,
    signed_at_location TEXT NOT NULL DEFAULT '',

    parent_guardian_co_signature_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (parent_guardian_co_signature_required IN ('', 'yes', 'no')),
    parent_guardian_name VARCHAR(255) NOT NULL DEFAULT '',
    parent_guardian_signature_confirmed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (parent_guardian_signature_confirmed IN ('', 'yes', 'no')),
    parent_guardian_signature_date DATE,

    witness_name VARCHAR(255) NOT NULL DEFAULT '',
    witness_signature_confirmed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (witness_signature_confirmed IN ('', 'yes', 'no')),
    witness_date DATE,
    witness_role VARCHAR(120) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_signature_witness_updated_at
    BEFORE UPDATE ON signature_witness
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE signature_witness IS
    'Signature, date, and witness fields. One-to-one child of hipaa_authorization. Required by 45 CFR § 164.508(c)(1)(vi).';
COMMENT ON COLUMN signature_witness.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN signature_witness.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN signature_witness.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN signature_witness.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN signature_witness.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN signature_witness.individual_signature_confirmed IS
    'Whether the individual (or their authorized representative) has confirmed the signature: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.individual_signature_image_uri IS
    'URI of the captured electronic signature image (SVG or PNG data URI).';
COMMENT ON COLUMN signature_witness.signature_date IS
    'Date the individual signed the authorization. Required by § 164.508(c)(1)(vi).';
COMMENT ON COLUMN signature_witness.signed_at_location IS
    'Optional location where the signature was captured (state, facility, or virtual).';
COMMENT ON COLUMN signature_witness.parent_guardian_co_signature_required IS
    'Whether a parent or guardian co-signature is required by state law: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.parent_guardian_name IS
    'Name of parent or guardian co-signing where required.';
COMMENT ON COLUMN signature_witness.parent_guardian_signature_confirmed IS
    'Whether the parent / guardian has confirmed their co-signature: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.parent_guardian_signature_date IS
    'Date the parent / guardian co-signed.';
COMMENT ON COLUMN signature_witness.witness_name IS
    'Name of the witness, when required by state law.';
COMMENT ON COLUMN signature_witness.witness_signature_confirmed IS
    'Whether the witness has confirmed their signature: yes, no, or empty.';
COMMENT ON COLUMN signature_witness.witness_date IS
    'Date the witness signed.';
COMMENT ON COLUMN signature_witness.witness_role IS
    'Role of the witness (e.g. notary, agency representative, healthcare professional).';

-- ========================================================================
-- END 11_create_table_signature_witness.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 12_create_table_validation_result.sql
-- ========================================================================

-- Result of the HIPAA-authorization validity engine.

CREATE TABLE validation_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hipaa_authorization_id UUID NOT NULL UNIQUE
        REFERENCES hipaa_authorization(id) ON DELETE CASCADE,
    validity_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (validity_status IN ('', 'valid', 'invalid')),
    completeness_score SMALLINT NOT NULL DEFAULT 0
        CHECK (completeness_score >= 0 AND completeness_score <= 100),
    completeness_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (completeness_status IN ('', 'complete', 'partial', 'empty')),
    validated_at TIMESTAMPTZ,
    validator_version VARCHAR(20) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_validation_result_updated_at
    BEFORE UPDATE ON validation_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE validation_result IS
    'Result of the HIPAA-authorization validity engine. One-to-one child of hipaa_authorization.';
COMMENT ON COLUMN validation_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN validation_result.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN validation_result.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN validation_result.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN validation_result.hipaa_authorization_id IS
    'Foreign key to the parent HIPAA authorization (unique, enforcing 1:1).';
COMMENT ON COLUMN validation_result.validity_status IS
    'Overall validity: valid, invalid, or empty if not yet run.';
COMMENT ON COLUMN validation_result.completeness_score IS
    'Completeness score 0..100 (ratio of filled to required fields).';
COMMENT ON COLUMN validation_result.completeness_status IS
    'Human-readable completeness band: complete, partial, empty, or empty if not run.';
COMMENT ON COLUMN validation_result.validated_at IS
    'Timestamp when the validation was last run.';
COMMENT ON COLUMN validation_result.validator_version IS
    'Engine version string (semver) recorded for reproducibility.';

-- ========================================================================
-- END 12_create_table_validation_result.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 13_create_table_validation_fired_rule.sql
-- ========================================================================

-- Validation rules that fired during the HIPAA-authorization check.

CREATE TABLE validation_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    validation_result_id UUID NOT NULL
        REFERENCES validation_result(id) ON DELETE CASCADE,
    rule_id VARCHAR(60) NOT NULL,
    citation VARCHAR(80) NOT NULL DEFAULT '',
    domain VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (domain IN ('', 'core-element', 'required-statement', 'sensitive-category', 'compound', 'expiration', 'representative')),
    description TEXT NOT NULL DEFAULT '',
    priority VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE TRIGGER trigger_validation_fired_rule_updated_at
    BEFORE UPDATE ON validation_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE validation_fired_rule IS
    'Validation rules that fired during the HIPAA-authorization check. Many-to-one child of validation_result.';
COMMENT ON COLUMN validation_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN validation_fired_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN validation_fired_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN validation_fired_rule.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN validation_fired_rule.validation_result_id IS
    'Foreign key to the parent validation result.';
COMMENT ON COLUMN validation_fired_rule.rule_id IS
    'Identifier of the validation rule that fired (e.g. phi-description-specific).';
COMMENT ON COLUMN validation_fired_rule.citation IS
    'Regulatory citation backing the rule (e.g. 45 CFR § 164.508(c)(1)(i)).';
COMMENT ON COLUMN validation_fired_rule.domain IS
    'Rule domain: core-element, required-statement, sensitive-category, compound, expiration, representative, or empty.';
COMMENT ON COLUMN validation_fired_rule.description IS
    'Human-readable description of what the rule checks.';
COMMENT ON COLUMN validation_fired_rule.priority IS
    'Rule priority: high, medium, or low.';

-- ========================================================================
-- END 13_create_table_validation_fired_rule.sql
-- ========================================================================

-- ========================================================================
-- BEGIN 14_create_table_validation_additional_flag.sql
-- ========================================================================

-- Additional flags raised during HIPAA-authorization validation.

CREATE TABLE validation_additional_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    validation_result_id UUID NOT NULL
        REFERENCES validation_result(id) ON DELETE CASCADE,
    flag_id VARCHAR(60) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN ('', 'sensitive-category', 'state-law', 'representative', 'minor', 'language', 'audit', 'reproductive-health')),
    message TEXT NOT NULL DEFAULT '',
    priority VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE TRIGGER trigger_validation_additional_flag_updated_at
    BEFORE UPDATE ON validation_additional_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE validation_additional_flag IS
    'Additional flags raised during HIPAA-authorization validation. Many-to-one child of validation_result.';
COMMENT ON COLUMN validation_additional_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN validation_additional_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN validation_additional_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN validation_additional_flag.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN validation_additional_flag.validation_result_id IS
    'Foreign key to the parent validation result.';
COMMENT ON COLUMN validation_additional_flag.flag_id IS
    'Identifier of the additional flag.';
COMMENT ON COLUMN validation_additional_flag.category IS
    'Flag category: sensitive-category, state-law, representative, minor, language, audit, reproductive-health, or empty.';
COMMENT ON COLUMN validation_additional_flag.message IS
    'Human-readable message describing the flag.';
COMMENT ON COLUMN validation_additional_flag.priority IS
    'Flag priority: high, medium, or low.';

-- ========================================================================
-- END 14_create_table_validation_additional_flag.sql
-- ========================================================================
