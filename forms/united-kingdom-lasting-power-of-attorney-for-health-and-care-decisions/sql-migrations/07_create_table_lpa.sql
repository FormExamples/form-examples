-- Lasting Power of Attorney for Health and Welfare (LP1H).
-- The header row that ties together donor, certificate provider, attorneys,
-- replacement attorneys, persons to notify, signatures, and registration.

CREATE TABLE lpa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    donor_id UUID NOT NULL
        REFERENCES donor(id) ON DELETE CASCADE,
    certificate_provider_id UUID
        REFERENCES certificate_provider(id) ON DELETE SET NULL,

    form_version VARCHAR(20) NOT NULL DEFAULT 'LP1H-2024',
    jurisdiction VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (jurisdiction IN ('england', 'wales', '')),

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'awaiting-signatures', 'ready-to-register',
                          'submitted-to-opg', 'registered', 'rejected', 'revoked')),
    opg_reference VARCHAR(50) NOT NULL DEFAULT '',
    registered_at TIMESTAMPTZ,
    effective_from TIMESTAMPTZ,

    notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX index_lpa_donor_id ON lpa(donor_id);
CREATE INDEX index_lpa_certificate_provider_id ON lpa(certificate_provider_id);
CREATE INDEX index_lpa_status ON lpa(status);

CREATE TRIGGER trigger_lpa_updated_at
    BEFORE UPDATE ON lpa
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa IS
    'Header row for a Lasting Power of Attorney for Health and Welfare under the Mental Capacity Act 2005.';
COMMENT ON COLUMN lpa.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa.donor_id IS
    'Foreign key to the donor.';
COMMENT ON COLUMN lpa.certificate_provider_id IS
    'Foreign key to the certificate provider. Nullable while the LPA is still in draft and the certificate provider has not been chosen.';
COMMENT ON COLUMN lpa.form_version IS
    'Version of the LP1H form template used (e.g. LP1H-2024).';
COMMENT ON COLUMN lpa.jurisdiction IS
    'Jurisdiction: england or wales (Mental Capacity Act 2005 applies to both).';
COMMENT ON COLUMN lpa.status IS
    'Lifecycle status of the LPA instrument.';
COMMENT ON COLUMN lpa.opg_reference IS
    'Office of the Public Guardian reference number once registered.';
COMMENT ON COLUMN lpa.registered_at IS
    'Timestamp at which the OPG registered this LPA.';
COMMENT ON COLUMN lpa.effective_from IS
    'Earliest date the LPA can be used (after registration and loss of capacity).';
COMMENT ON COLUMN lpa.notes IS
    'Free-text notes from the donor, solicitor, or case manager.';
