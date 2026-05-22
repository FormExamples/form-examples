-- Registration application (LP1H Part C). The applicant — the donor, a single
-- attorney, or all attorneys jointly — applies to the Office of the Public
-- Guardian to register the LPA. Includes the £82 fee and any remission /
-- exemption claim. 1:1 with lpa.

CREATE TABLE lpa_registration_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE
        REFERENCES lpa(id) ON DELETE CASCADE,
    applicant_role VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (applicant_role IN ('donor', 'attorney', 'attorneys-jointly', '')),
    applicant_signed_at TIMESTAMPTZ,
    fee_amount_pounds NUMERIC(6,2) NOT NULL DEFAULT 0,
    fee_remission VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (fee_remission IN ('none', 'half', 'full-exempt', '')),
    fee_remission_reason VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (fee_remission_reason IN (
            'low-income', 'universal-credit', 'income-support',
            'pension-credit-guarantee', 'housing-benefit',
            'employment-and-support-allowance', 'jobseekers-allowance',
            'working-tax-credit', 'other', ''
        )),
    submitted_at TIMESTAMPTZ,
    submission_channel VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (submission_channel IN ('post', 'opg-digital', 'solicitor-portal', ''))
);

CREATE TRIGGER trigger_lpa_registration_application_updated_at
    BEFORE UPDATE ON lpa_registration_application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_registration_application IS
    'OPG registration application (LP1H Part C). 1:1 with lpa.';
COMMENT ON COLUMN lpa_registration_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_registration_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_registration_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_registration_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_registration_application.lpa_id IS
    'Foreign key to the parent LPA (unique, 1:1).';
COMMENT ON COLUMN lpa_registration_application.applicant_role IS
    'Who is applying to register: donor, attorney (one), or attorneys-jointly (all).';
COMMENT ON COLUMN lpa_registration_application.applicant_signed_at IS
    'Timestamp at which the applicant signed Part C.';
COMMENT ON COLUMN lpa_registration_application.fee_amount_pounds IS
    'Application fee in GBP. Standard £82 (2026); zero when full exemption applies.';
COMMENT ON COLUMN lpa_registration_application.fee_remission IS
    'Remission level: none, half (50% off), or full-exempt.';
COMMENT ON COLUMN lpa_registration_application.fee_remission_reason IS
    'Statutory basis for the remission or exemption claim.';
COMMENT ON COLUMN lpa_registration_application.submitted_at IS
    'Timestamp at which the application was submitted to the OPG.';
COMMENT ON COLUMN lpa_registration_application.submission_channel IS
    'Channel: post, opg-digital (Powers of Attorney Act 2023), or solicitor-portal.';
