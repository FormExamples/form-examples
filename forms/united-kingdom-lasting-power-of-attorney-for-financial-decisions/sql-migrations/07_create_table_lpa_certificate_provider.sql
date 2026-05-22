--liquibase formatted sql

--changeset author:1
-- LPA certificate provider — the person who certifies that the donor
-- understands the LPA and is not under pressure (LP1F section 10).
-- Exactly one per LPA, enforced by UNIQUE (lpa_id).

CREATE TABLE lpa_certificate_provider (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES person(id) ON DELETE RESTRICT,
    knows_donor_as TEXT NOT NULL DEFAULT '' CHECK (knows_donor_as IN ('friend', 'professional', '')),
    is_over_eighteen BOOLEAN NOT NULL DEFAULT FALSE,
    read_lpa BOOLEAN NOT NULL DEFAULT FALSE,
    no_restrictions_on_acting BOOLEAN NOT NULL DEFAULT FALSE,
    eligibility_confirmation_at TIMESTAMPTZ
);
--rollback DROP TABLE lpa_certificate_provider;

--changeset author:2
CREATE TRIGGER trigger_lpa_certificate_provider_updated_at
    BEFORE UPDATE ON lpa_certificate_provider
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_certificate_provider_updated_at ON lpa_certificate_provider;

--changeset author:3
COMMENT ON TABLE lpa_certificate_provider IS
    'LPA certificate provider — the single person who certifies the donor''s capacity and lack of undue pressure (LP1F section 10).';
COMMENT ON COLUMN lpa_certificate_provider.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_certificate_provider.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_certificate_provider.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_certificate_provider.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_certificate_provider.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; UNIQUE so only one certificate provider per LPA; cascades on delete.';
COMMENT ON COLUMN lpa_certificate_provider.person_id IS
    'Foreign key to the person table — the certificate provider.';
COMMENT ON COLUMN lpa_certificate_provider.knows_donor_as IS
    'How the certificate provider knows the donor. One of: friend (known personally for 2+ years), professional (relevant professional skill such as GP, solicitor).';
COMMENT ON COLUMN lpa_certificate_provider.is_over_eighteen IS
    'TRUE when the certificate provider confirms they are aged 18 or over.';
COMMENT ON COLUMN lpa_certificate_provider.read_lpa IS
    'TRUE when the certificate provider confirms they have read the LPA.';
COMMENT ON COLUMN lpa_certificate_provider.no_restrictions_on_acting IS
    'TRUE when the certificate provider confirms no statutory disqualification applies (not an attorney, not related, not a care-home owner — LPA Regulations 2007 reg. 8).';
COMMENT ON COLUMN lpa_certificate_provider.eligibility_confirmation_at IS
    'Timestamp when the certificate provider completed the eligibility confirmation checklist.';
--rollback SELECT 1;
