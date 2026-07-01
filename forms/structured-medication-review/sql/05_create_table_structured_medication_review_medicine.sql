-- Medicines reviewed within a structured medication review. Each medicine is
-- one row and cascades from the parent structured_medication_review. A row
-- carries the drug name, form and strength, dose regimen, indication and
-- whether it is recorded, whether the medicine is regular (counts toward
-- polypharmacy), whether it is high-risk and its high-risk class, the
-- patient's adherence, the anticholinergic burden points (0-3 on the ACB
-- scale), the monitoring status, whether it is a deprescribing candidate, and
-- any STOPP or START criterion identified.

CREATE TABLE structured_medication_review_medicine (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    structured_medication_review_id UUID NOT NULL
        REFERENCES structured_medication_review(id) ON DELETE CASCADE,

    drug_name TEXT NOT NULL DEFAULT '',
    form_strength TEXT NOT NULL DEFAULT '',
    dose_regimen TEXT NOT NULL DEFAULT '',
    indication TEXT NOT NULL DEFAULT '',
    indication_recorded VARCHAR(5) NOT NULL DEFAULT '' CHECK (indication_recorded IN ('yes', 'no', '')),
    is_regular VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_regular IN ('yes', 'no', '')),
    is_high_risk VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_high_risk IN ('yes', 'no', '')),
    high_risk_class VARCHAR(15) NOT NULL DEFAULT '' CHECK (high_risk_class IN ('anticoagulant', 'insulin', 'opioid', 'dmard', 'lithium', 'methotrexate', 'other', '')),
    adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (adherence IN ('good', 'partial', 'poor', 'unknown', '')),
    anticholinergic_burden_points INTEGER CHECK (anticholinergic_burden_points BETWEEN 0 AND 3),
    monitoring_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (monitoring_required IN ('yes', 'no', '')),
    monitoring_up_to_date VARCHAR(5) NOT NULL DEFAULT '' CHECK (monitoring_up_to_date IN ('yes', 'no', 'na', '')),
    deprescribing_candidate VARCHAR(5) NOT NULL DEFAULT '' CHECK (deprescribing_candidate IN ('yes', 'no', '')),
    stopp_criterion TEXT NOT NULL DEFAULT '',
    start_criterion TEXT NOT NULL DEFAULT ''
);

CREATE INDEX structured_medication_review_medicine_review_id_idx
    ON structured_medication_review_medicine (structured_medication_review_id);

CREATE TRIGGER trigger_structured_medication_review_medicine_updated_at
    BEFORE UPDATE ON structured_medication_review_medicine
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE structured_medication_review_medicine IS
    'Medicines reviewed within a structured medication review: name, form and strength, dose, indication, regular/high-risk flags, adherence, anticholinergic burden, monitoring, deprescribing candidacy, and STOPP/START criteria.';
COMMENT ON COLUMN structured_medication_review_medicine.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN structured_medication_review_medicine.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN structured_medication_review_medicine.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN structured_medication_review_medicine.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN structured_medication_review_medicine.structured_medication_review_id IS
    'Foreign key to the parent structured medication review.';
COMMENT ON COLUMN structured_medication_review_medicine.drug_name IS
    'Medicine name.';
COMMENT ON COLUMN structured_medication_review_medicine.form_strength IS
    'Form and strength of the medicine (e.g. tablet 5 mg).';
COMMENT ON COLUMN structured_medication_review_medicine.dose_regimen IS
    'Dose and frequency (e.g. one tablet twice daily).';
COMMENT ON COLUMN structured_medication_review_medicine.indication IS
    'Reason the medicine is prescribed.';
COMMENT ON COLUMN structured_medication_review_medicine.indication_recorded IS
    'Whether an indication is recorded for the medicine: yes or no.';
COMMENT ON COLUMN structured_medication_review_medicine.is_regular IS
    'Whether the medicine is a regular (repeat) medicine that counts toward polypharmacy: yes or no.';
COMMENT ON COLUMN structured_medication_review_medicine.is_high_risk IS
    'Whether the medicine is a high-risk medicine: yes or no.';
COMMENT ON COLUMN structured_medication_review_medicine.high_risk_class IS
    'High-risk medicine class: anticoagulant, insulin, opioid, dmard, lithium, methotrexate, or other.';
COMMENT ON COLUMN structured_medication_review_medicine.adherence IS
    'Patient adherence to the medicine: good, partial, poor, or unknown.';
COMMENT ON COLUMN structured_medication_review_medicine.anticholinergic_burden_points IS
    'Anticholinergic Cognitive Burden (ACB) points for the medicine, 0-3; null when unanswered (contributes 0 to the sum).';
COMMENT ON COLUMN structured_medication_review_medicine.monitoring_required IS
    'Whether the medicine requires monitoring: yes or no.';
COMMENT ON COLUMN structured_medication_review_medicine.monitoring_up_to_date IS
    'Whether required monitoring is up to date: yes, no, or na (not applicable).';
COMMENT ON COLUMN structured_medication_review_medicine.deprescribing_candidate IS
    'Whether the medicine is a candidate for deprescribing: yes or no.';
COMMENT ON COLUMN structured_medication_review_medicine.stopp_criterion IS
    'STOPP code / description for a potentially inappropriate medicine, or empty.';
COMMENT ON COLUMN structured_medication_review_medicine.start_criterion IS
    'START code / description for a potential prescribing omission, or empty.';
