-- Main Confusion Assessment Method (CAM) record: assessment context,
-- patient identification, and the four observational feature inputs
-- (acute onset and fluctuating course, inattention, disorganised
-- thinking, altered level of consciousness) plus the CAM-ICU support
-- fields. The computed classification, fired rules, and flags live in
-- dedicated child tables. This is a status / classification form: there
-- is no numeric total.

CREATE TABLE confusion_assessment_method (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessor and encounter
    assessor_name VARCHAR(255) NOT NULL DEFAULT '',
    assessor_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (assessor_role IN ('nurse', 'doctor', 'geriatrician', 'liaison-psychiatrist', 'physiotherapist', 'occupational-therapist', 'researcher', 'other', '')),
    assessed_at TIMESTAMPTZ,
    ward_unit VARCHAR(100) NOT NULL DEFAULT '',
    cam_variant VARCHAR(10) NOT NULL DEFAULT '' CHECK (cam_variant IN ('cam', 'cam-icu', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    cognitive_baseline VARCHAR(30) NOT NULL DEFAULT '' CHECK (cognitive_baseline IN ('independent', 'known-dementia', 'mild-cognitive-impairment', 'unknown', '')),
    collateral_source VARCHAR(30) NOT NULL DEFAULT '' CHECK (collateral_source IN ('family', 'carer', 'nurse', 'notes', 'none', '')),

    -- Step 3: feature 1 — acute onset and fluctuating course
    feature_acute_onset_fluctuating VARCHAR(10) NOT NULL DEFAULT '' CHECK (feature_acute_onset_fluctuating IN ('present', 'absent', '')),
    onset_timing VARCHAR(20) NOT NULL DEFAULT '' CHECK (onset_timing IN ('hours', 'days', 'weeks', 'unknown', '')),

    -- Step 4: feature 2 — inattention
    feature_inattention VARCHAR(10) NOT NULL DEFAULT '' CHECK (feature_inattention IN ('present', 'absent', '')),
    attention_test VARCHAR(30) NOT NULL DEFAULT '' CHECK (attention_test IN ('digit-span', 'months-backwards', 'serial-sevens', 'attention-screening-examination', 'not-completable', '')),

    -- Step 5: feature 3 — disorganised thinking
    feature_disorganised_thinking VARCHAR(10) NOT NULL DEFAULT '' CHECK (feature_disorganised_thinking IN ('present', 'absent', '')),

    -- Step 6: feature 4 — altered level of consciousness
    feature_altered_consciousness VARCHAR(10) NOT NULL DEFAULT '' CHECK (feature_altered_consciousness IN ('present', 'absent', '')),
    consciousness_level VARCHAR(20) NOT NULL DEFAULT '' CHECK (consciousness_level IN ('alert', 'vigilant', 'lethargic', 'stupor', 'coma', '')),
    rass_score INT CHECK (rass_score BETWEEN -5 AND 4),

    -- Step 7: motoric subtype and observations
    motoric_subtype VARCHAR(20) NOT NULL DEFAULT '' CHECK (motoric_subtype IN ('hypoactive', 'hyperactive', 'mixed', 'normal', '')),
    hallucinations BOOLEAN NOT NULL DEFAULT FALSE,
    delusions BOOLEAN NOT NULL DEFAULT FALSE,
    sleep_wake_disturbance BOOLEAN NOT NULL DEFAULT FALSE,
    deliriogenic_medication BOOLEAN NOT NULL DEFAULT FALSE,
    deliriogenic_medication_detail TEXT NOT NULL DEFAULT '',

    -- Step 8: result and disposition
    suspected_precipitants TEXT NOT NULL DEFAULT '',
    recommended_actions TEXT NOT NULL DEFAULT '',
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX confusion_assessment_method_patient_id_idx
    ON confusion_assessment_method (patient_id);
CREATE INDEX confusion_assessment_method_clinician_id_idx
    ON confusion_assessment_method (clinician_id);

CREATE TRIGGER trigger_confusion_assessment_method_updated_at
    BEFORE UPDATE ON confusion_assessment_method
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE confusion_assessment_method IS
    'Main Confusion Assessment Method (CAM) record: assessment context, patient identification, and the four observational feature inputs plus CAM-ICU support fields. Status / classification form with no numeric total.';
COMMENT ON COLUMN confusion_assessment_method.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN confusion_assessment_method.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN confusion_assessment_method.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN confusion_assessment_method.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN confusion_assessment_method.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN confusion_assessment_method.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN confusion_assessment_method.assessor_name IS
    'Name of the assessor as recorded on the assessment.';
COMMENT ON COLUMN confusion_assessment_method.assessor_role IS
    'Role of the assessor: nurse, doctor, geriatrician, liaison-psychiatrist, physiotherapist, occupational-therapist, researcher, or other.';
COMMENT ON COLUMN confusion_assessment_method.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN confusion_assessment_method.ward_unit IS
    'Ward or unit where the assessment took place.';
COMMENT ON COLUMN confusion_assessment_method.cam_variant IS
    'Assessment variant: cam (standard bedside) or cam-icu (ventilated / non-verbal patients).';
COMMENT ON COLUMN confusion_assessment_method.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN confusion_assessment_method.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN confusion_assessment_method.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN confusion_assessment_method.cognitive_baseline IS
    'Cognitive baseline before the acute change: independent, known-dementia, mild-cognitive-impairment, or unknown.';
COMMENT ON COLUMN confusion_assessment_method.collateral_source IS
    'Source of collateral history establishing the baseline: family, carer, nurse, notes, or none.';
COMMENT ON COLUMN confusion_assessment_method.feature_acute_onset_fluctuating IS
    'Feature 1 — acute onset and fluctuating course: present or absent (empty when unset).';
COMMENT ON COLUMN confusion_assessment_method.onset_timing IS
    'Timing of the acute change from baseline: hours, days, weeks, or unknown.';
COMMENT ON COLUMN confusion_assessment_method.feature_inattention IS
    'Feature 2 — inattention: present or absent (empty when unset).';
COMMENT ON COLUMN confusion_assessment_method.attention_test IS
    'Attention test used: digit-span, months-backwards, serial-sevens, attention-screening-examination (CAM-ICU), or not-completable.';
COMMENT ON COLUMN confusion_assessment_method.feature_disorganised_thinking IS
    'Feature 3 — disorganised thinking: present or absent (empty when unset).';
COMMENT ON COLUMN confusion_assessment_method.feature_altered_consciousness IS
    'Feature 4 — altered level of consciousness: present or absent (empty when unset).';
COMMENT ON COLUMN confusion_assessment_method.consciousness_level IS
    'Observed level of consciousness: alert, vigilant, lethargic, stupor, or coma.';
COMMENT ON COLUMN confusion_assessment_method.rass_score IS
    'Richmond Agitation-Sedation Scale score (-5 to +4); recorded for the CAM-ICU variant. RASS -4/-5 (unrousable) yields an unable-to-assess classification.';
COMMENT ON COLUMN confusion_assessment_method.motoric_subtype IS
    'Psychomotor subtype of delirium: hypoactive, hyperactive, mixed, or normal.';
COMMENT ON COLUMN confusion_assessment_method.hallucinations IS
    'Whether hallucinations were observed during the assessment.';
COMMENT ON COLUMN confusion_assessment_method.delusions IS
    'Whether delusions were observed during the assessment.';
COMMENT ON COLUMN confusion_assessment_method.sleep_wake_disturbance IS
    'Whether a sleep-wake cycle disturbance was observed.';
COMMENT ON COLUMN confusion_assessment_method.deliriogenic_medication IS
    'Whether a recent high-risk deliriogenic medication (anticholinergic, benzodiazepine, opioid) was noted.';
COMMENT ON COLUMN confusion_assessment_method.deliriogenic_medication_detail IS
    'Free-text detail of the deliriogenic medication noted.';
COMMENT ON COLUMN confusion_assessment_method.suspected_precipitants IS
    'Free-text note of suspected reversible precipitants (PINCH ME screen).';
COMMENT ON COLUMN confusion_assessment_method.recommended_actions IS
    'Free-text note of recommended actions and disposition.';
COMMENT ON COLUMN confusion_assessment_method.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
