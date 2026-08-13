-- Join table: which allergens a patient reacts to, with the reaction and its
-- severity, because a dietetic care plan must exclude the allergen and an
-- anaphylaxis history fires a high-priority safety flag.

CREATE TABLE patient_allergy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    allergy_id UUID NOT NULL REFERENCES allergy(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL DEFAULT '',
    severity TEXT NOT NULL DEFAULT '' CHECK (severity IN ('mild', 'moderate', 'severe', 'anaphylaxis', '')),
    kind TEXT NOT NULL DEFAULT '' CHECK (kind IN ('allergy', 'intolerance', 'avoidance-by-choice', 'unknown', '')),
    diagnosis_method TEXT NOT NULL DEFAULT '' CHECK (diagnosis_method IN ('clinically-diagnosed', 'skin-prick-test', 'specific-ige', 'oral-food-challenge', 'elimination-and-reintroduction', 'self-reported', '')),
    onset_on DATE,
    adrenaline_auto_injector BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_allergy_updated_at
    BEFORE UPDATE ON patient_allergy
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX patient_allergy_patient_id_index
    ON patient_allergy (patient_id);

CREATE INDEX patient_allergy_allergy_id_index
    ON patient_allergy (allergy_id);

CREATE UNIQUE INDEX patient_allergy_patient_id_allergy_id_index
    ON patient_allergy (patient_id, allergy_id);

COMMENT ON TABLE patient_allergy IS
    'Patient allergy, i.e. one allergen that one patient reacts to, with the reaction and its severity.';
COMMENT ON COLUMN patient_allergy.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient_allergy.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient_allergy.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient_allergy.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient_allergy.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN patient_allergy.allergy_id IS
    'Foreign key to the allergy table.';
COMMENT ON COLUMN patient_allergy.reaction IS
    'Reaction the patient experiences, such as urticaria, angioedema, vomiting, or abdominal pain.';
COMMENT ON COLUMN patient_allergy.severity IS
    'Severity of the reaction, where anaphylaxis fires the allergy-anaphylaxis-risk safety flag.';
COMMENT ON COLUMN patient_allergy.kind IS
    'Whether this is a true allergy, an intolerance, or an avoidance by choice, because the three lead to different dietetic advice.';
COMMENT ON COLUMN patient_allergy.diagnosis_method IS
    'How the allergy or intolerance was established, such as for judging the confidence of a self-reported avoidance.';
COMMENT ON COLUMN patient_allergy.onset_on IS
    'Date of first known reaction, where known.';
COMMENT ON COLUMN patient_allergy.adrenaline_auto_injector IS
    'Whether the patient carries an adrenaline auto-injector.';
COMMENT ON COLUMN patient_allergy.notes IS
    'Free-text notes about this allergen for this patient.';
