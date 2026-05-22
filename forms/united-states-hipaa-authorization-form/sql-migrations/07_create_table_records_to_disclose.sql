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
