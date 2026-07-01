-- Main SOAP-note record: one patient encounter documented in the four
-- SOAP sections (Subjective, Objective, Assessment, Plan) plus encounter
-- context and patient / clinician identification. The completeness grade,
-- the audit trail of fired grading rules, and the safety flags live in
-- dedicated child tables. All clinical content is free text; presence of
-- a component is detected by a non-empty field, not by semantic analysis.

CREATE TABLE soap_note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Encounter context and identification
    encountered_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'outpatient', 'ward', 'emergency-department', 'community', 'telehealth', 'other', '')),
    encounter_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (encounter_type IN ('new-problem', 'follow-up', 'review', 'other', '')),
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'paramedic', 'pharmacist', 'allied-health', 'other', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',

    -- Subjective
    presenting_complaint TEXT NOT NULL DEFAULT '',
    history_of_presenting_complaint TEXT NOT NULL DEFAULT '',
    patient_reported_symptoms TEXT NOT NULL DEFAULT '',
    relevant_history TEXT NOT NULL DEFAULT '',
    red_flag_symptoms VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_symptoms IN ('yes', 'no', '')),

    -- Objective
    examination_findings TEXT NOT NULL DEFAULT '',
    vital_signs TEXT NOT NULL DEFAULT '',
    abnormal_vitals_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (abnormal_vitals_present IN ('yes', 'no', '')),
    investigation_results TEXT NOT NULL DEFAULT '',

    -- Assessment
    primary_diagnosis TEXT NOT NULL DEFAULT '',
    problem_list TEXT NOT NULL DEFAULT '',
    differential TEXT NOT NULL DEFAULT '',
    clinical_impression TEXT NOT NULL DEFAULT '',

    -- Plan
    investigations_plan TEXT NOT NULL DEFAULT '',
    treatment_plan TEXT NOT NULL DEFAULT '',
    referrals TEXT NOT NULL DEFAULT '',
    follow_up TEXT NOT NULL DEFAULT '',
    safety_netting TEXT NOT NULL DEFAULT '',
    managed_at_home VARCHAR(5) NOT NULL DEFAULT '' CHECK (managed_at_home IN ('yes', 'no', '')),

    -- Free-text narrative
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX soap_note_patient_id_idx
    ON soap_note (patient_id);
CREATE INDEX soap_note_clinician_id_idx
    ON soap_note (clinician_id);

CREATE TRIGGER trigger_soap_note_updated_at
    BEFORE UPDATE ON soap_note
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE soap_note IS
    'Main SOAP-note record for one patient encounter: encounter context, patient and clinician identification, and the four SOAP sections (Subjective, Objective, Assessment, Plan) as free text. Completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN soap_note.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN soap_note.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN soap_note.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN soap_note.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN soap_note.patient_id IS
    'Foreign key to the patient this note documents (restrict delete).';
COMMENT ON COLUMN soap_note.clinician_id IS
    'Foreign key to the authoring clinician (restrict delete); optional.';
COMMENT ON COLUMN soap_note.encountered_at IS
    'Date and time of the patient encounter.';
COMMENT ON COLUMN soap_note.care_setting IS
    'Care setting: general-practice, outpatient, ward, emergency-department, community, telehealth, or other.';
COMMENT ON COLUMN soap_note.encounter_type IS
    'Encounter type: new-problem, follow-up, review, or other.';
COMMENT ON COLUMN soap_note.clinician_role IS
    'Authoring clinician role: doctor, nurse, paramedic, pharmacist, allied-health, or other.';
COMMENT ON COLUMN soap_note.patient_identifier IS
    'Local patient or encounter identifier as recorded on the note.';
COMMENT ON COLUMN soap_note.presenting_complaint IS
    'Subjective: the presenting complaint (required component).';
COMMENT ON COLUMN soap_note.history_of_presenting_complaint IS
    'Subjective: the history of the presenting complaint (required component).';
COMMENT ON COLUMN soap_note.patient_reported_symptoms IS
    'Subjective: patient-reported symptoms (optional).';
COMMENT ON COLUMN soap_note.relevant_history IS
    'Subjective: relevant past history, medication, and allergies (optional).';
COMMENT ON COLUMN soap_note.red_flag_symptoms IS
    'Whether red-flag symptoms are present (yes/no); yes makes safety-netting a required component.';
COMMENT ON COLUMN soap_note.examination_findings IS
    'Objective: examination findings; satisfies the Objective section when non-empty.';
COMMENT ON COLUMN soap_note.vital_signs IS
    'Objective: recorded vital signs; satisfies the Objective section when non-empty.';
COMMENT ON COLUMN soap_note.abnormal_vitals_present IS
    'Whether abnormal vital signs are present (yes/no); drives the abnormal-vitals-not-addressed flag.';
COMMENT ON COLUMN soap_note.investigation_results IS
    'Objective: investigation or test results; satisfies the Objective section when non-empty.';
COMMENT ON COLUMN soap_note.primary_diagnosis IS
    'Assessment: the primary diagnosis or problem (required component).';
COMMENT ON COLUMN soap_note.problem_list IS
    'Assessment: the problem list (optional).';
COMMENT ON COLUMN soap_note.differential IS
    'Assessment: differential diagnoses (optional).';
COMMENT ON COLUMN soap_note.clinical_impression IS
    'Assessment: overall clinical impression (optional).';
COMMENT ON COLUMN soap_note.investigations_plan IS
    'Plan: investigations planned.';
COMMENT ON COLUMN soap_note.treatment_plan IS
    'Plan: treatment plan.';
COMMENT ON COLUMN soap_note.referrals IS
    'Plan: referrals made or requested.';
COMMENT ON COLUMN soap_note.follow_up IS
    'Plan: follow-up arrangement; satisfies the conditional follow-up requirement.';
COMMENT ON COLUMN soap_note.safety_netting IS
    'Plan: safety-netting advice; a required component when red-flag symptoms are present or the patient is managed at home.';
COMMENT ON COLUMN soap_note.managed_at_home IS
    'Whether the patient is managed at home (yes/no); yes makes safety-netting a required component.';
COMMENT ON COLUMN soap_note.clinical_note IS
    'Optional free-text narrative shown in the summary.';
