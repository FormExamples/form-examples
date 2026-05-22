-- Life-sustaining treatment choice. LP1H s.5 forces the donor to choose:
--   Option A — attorneys may give or refuse consent to life-sustaining treatment
--   Option B — only the donor (when they had capacity) may decide
-- MCA 2005 s.11(7)(c): without an express Option A election, an attorney has
-- no authority over life-sustaining treatment.
-- 1:1 with lpa.

CREATE TABLE lpa_lst_choice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE
        REFERENCES lpa(id) ON DELETE CASCADE,
    lst_choice VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (lst_choice IN ('option-a', 'option-b', '')),
    donor_initialled VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (donor_initialled IN ('yes', 'no', '')),
    initialled_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_lpa_lst_choice_updated_at
    BEFORE UPDATE ON lpa_lst_choice
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_lst_choice IS
    'Donor election under MCA 2005 s.11(7) on life-sustaining treatment authority for attorneys.';
COMMENT ON COLUMN lpa_lst_choice.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_lst_choice.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_lst_choice.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_lst_choice.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_lst_choice.lpa_id IS
    'Foreign key to the parent LPA (unique, 1:1).';
COMMENT ON COLUMN lpa_lst_choice.lst_choice IS
    'option-a: attorneys may decide; option-b: donor reserves the decision. Empty until donor selects (R-MCA-LST-CHOICE fires fatal until set).';
COMMENT ON COLUMN lpa_lst_choice.donor_initialled IS
    'Whether the donor has personally initialled the chosen option as required by the statutory form.';
COMMENT ON COLUMN lpa_lst_choice.initialled_at IS
    'Timestamp when the donor initialled the option.';
