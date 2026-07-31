-- Prescribing-change rows for an inpatient clinical note. One row per drug
-- started, stopped, dose-changed, held, or explicitly continued, with the
-- indication and the review date that NICE NG15 requires for antimicrobials.

CREATE TABLE inpatient_clinical_note_medication_change (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    inpatient_clinical_note_id UUID NOT NULL
        REFERENCES inpatient_clinical_note(id) ON DELETE CASCADE,

    sort_order INTEGER NOT NULL DEFAULT 0,
    drug_name VARCHAR(255) NOT NULL DEFAULT '',
    action VARCHAR(20) NOT NULL DEFAULT '' CHECK (action IN ('started', 'stopped', 'dose-changed', 'held', 'continued', 'switched', '')),
    dose VARCHAR(60) NOT NULL DEFAULT '',
    route VARCHAR(20) NOT NULL DEFAULT '' CHECK (route IN ('oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 'inhaled', 'rectal', 'nasogastric', 'sublingual', 'other', '')),
    frequency VARCHAR(60) NOT NULL DEFAULT '',
    indication VARCHAR(255) NOT NULL DEFAULT '',
    is_antimicrobial VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_antimicrobial IN ('yes', 'no', '')),
    review_date DATE,
    stop_date DATE,
    dmd_code VARCHAR(30) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX inpatient_clinical_note_medication_change_note_id_idx
    ON inpatient_clinical_note_medication_change (inpatient_clinical_note_id);

CREATE TRIGGER trigger_inpatient_clinical_note_medication_change_updated_at
    BEFORE UPDATE ON inpatient_clinical_note_medication_change
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE inpatient_clinical_note_medication_change IS
    'Prescribing-change rows for an inpatient clinical note: one row per drug started, stopped, dose-changed, held, switched, or explicitly continued, with indication, route, and review date.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.inpatient_clinical_note_id IS
    'Foreign key to the parent inpatient clinical note.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.sort_order IS
    'Display order of the change within the list, ascending.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.drug_name IS
    'Drug name, generic where possible.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.action IS
    'Prescribing action: started, stopped, dose-changed, held, continued, or switched.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.dose IS
    'Dose as prescribed.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.route IS
    'Route of administration: oral, intravenous, intramuscular, subcutaneous, topical, inhaled, rectal, nasogastric, sublingual, or other.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.frequency IS
    'Dosing frequency as prescribed.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.indication IS
    'Indication for the drug. Required by NICE NG15 for every antimicrobial.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.is_antimicrobial IS
    'Whether the drug is an antimicrobial, which brings it under the NICE NG15 stewardship review requirement.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.review_date IS
    'Date the prescription falls due for review.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.stop_date IS
    'Planned stop date, where a course length is defined.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.dmd_code IS
    'Dictionary of Medicines and Devices (dm+d) code, where coded.';
COMMENT ON COLUMN inpatient_clinical_note_medication_change.notes IS
    'Free-text notes on the change, including the reason for it.';
