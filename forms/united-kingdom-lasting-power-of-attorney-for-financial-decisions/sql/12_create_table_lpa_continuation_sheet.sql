--liquibase formatted sql

--changeset author:1
-- LPA continuation sheet — the four LPC continuation sheets that extend
-- the LP1F deed when on-form space is exhausted or when special
-- circumstances apply (5+ attorneys, mixed decision modes, donor
-- cannot sign, or a trust corporation is appointed).

CREATE TABLE lpa_continuation_sheet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('1_additional_people', '2_additional_information', '3_donor_cannot_sign', '4_trust_corporation')),
    body_text TEXT NOT NULL DEFAULT '',
    signed_on DATE,
    ordinal SMALLINT NOT NULL DEFAULT 1
);
--rollback DROP TABLE lpa_continuation_sheet;

--changeset author:2
CREATE TRIGGER trigger_lpa_continuation_sheet_updated_at
    BEFORE UPDATE ON lpa_continuation_sheet
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_continuation_sheet_updated_at ON lpa_continuation_sheet;

--changeset author:3
COMMENT ON TABLE lpa_continuation_sheet IS
    'LPA continuation sheet — one row per LPC continuation sheet (LPC sheets 1, 2, 3, 4) attached to the LP1F deed.';
COMMENT ON COLUMN lpa_continuation_sheet.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_continuation_sheet.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_continuation_sheet.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_continuation_sheet.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_continuation_sheet.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; cascades on delete.';
COMMENT ON COLUMN lpa_continuation_sheet.kind IS
    'Which LPC sheet this is. One of: 1_additional_people (5+ attorneys / replacements / people-to-notify), 2_additional_information (overflow text for sections 3, 4, 7), 3_donor_cannot_sign, 4_trust_corporation.';
COMMENT ON COLUMN lpa_continuation_sheet.body_text IS
    'Free-text body of the continuation sheet (the OPG validates that text on a continuation sheet round-trips to the deed).';
COMMENT ON COLUMN lpa_continuation_sheet.signed_on IS
    'Date the continuation sheet was signed (LPC sheets 3 and 4 require their own signature dates).';
COMMENT ON COLUMN lpa_continuation_sheet.ordinal IS
    'Position when an LPA carries more than one continuation sheet of the same kind (e.g. multiple sheet-2 overflow pages).';
--rollback SELECT 1;
